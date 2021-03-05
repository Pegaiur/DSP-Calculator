import Recipe, { getRecipe } from './Recipe';
import Production from './Production';
import DisplayResult from './DisplayResult';
import GlobalParameter from './GlobalParameter';
import _ from 'lodash';
import { allItemNameArray } from '@/items';

export interface Requirement {
  item: string;
  expectedYieldPerMin: number;
}

export default class Core {
  globalParameters: GlobalParameter;
  requirements: { [item: string]: number } = {};
  specifiedRecipes: { [item: string]: Recipe } = {};

  private productions: Production[] = [];
  private byproductions: Production[] = [];
  private results: DisplayResult[] = [];
  private byproducts: DisplayResult[] = [];
  private calculateStack: Requirement[] = [];

  constructor(globalParameters: GlobalParameter) {
    this.globalParameters = globalParameters;
  }

  calculate(
    requirements: { [item: string]: number },
    callback: (results: DisplayResult[], byproducts: DisplayResult[]) => void,
  ) {
    this.cleanStack();
    this.requirements = requirements;
    this.calculateProductions();
    this.productions.forEach((production) => {
      this.addResult(this.results, production);
    });
    this.byproductions.forEach((production) => {
      this.addResult(this.byproducts, production);
    });
    this.productions.forEach((production) => {
      if (!production.recipe.isMiningRecipe) {
        this.addConsumption(production);
      }
    });
    this.results.sort((aResult, bResult) => {
      return (
        allItemNameArray.indexOf(aResult.item) -
        allItemNameArray.indexOf(bResult.item)
      );
    });
    this.byproducts.sort((aResult, bResult) => {
      return (
        allItemNameArray.indexOf(aResult.item) -
        allItemNameArray.indexOf(bResult.item)
      );
    });
    callback(this.results, this.byproducts);
  }

  updateSpecifiedRecipes(
    specifiedRecipes: { [item: string]: Recipe },
    callback: (results: DisplayResult[], byproducts: DisplayResult[]) => void,
  ) {
    this.specifiedRecipes = specifiedRecipes;
    this.calculate(this.requirements, callback);
  }

  requirementsConvert(object: { [item: string]: number }) {
    let requirements: Requirement[] = [];
    for (let item in object) {
      requirements.push({ item: item, expectedYieldPerMin: object[item] });
    }
    return requirements;
  }

  private cleanStack() {
    this.productions = [];
    this.byproductions = [];
    this.calculateStack = [];
    this.results = [];
    this.byproducts = [];
  }

  private calculateProductions() {
    let requirements = this.requirementsConvert(this.requirements);
    requirements.forEach((requirement) =>
      this.calculateStack.push(requirement),
    );
    for (let i = 0; i < this.calculateStack.length; i++) {
      const requirement = this.calculateStack[i];
      this.checkByproduction(requirement);
      if (requirement.expectedYieldPerMin > 0) {
        let availableRecipes = getRecipe(requirement.item);
        let recipe = availableRecipes.find((recipe) => {
          if (recipe.equivalentRecipe != undefined) {
            return recipe.equivalentRecipe.products.length == 1;
          }
          return recipe.products.length == 1;
        });
        if (recipe == undefined) {
          recipe = availableRecipes[0];
        }
        if (this.specifiedRecipes[requirement.item] != undefined) {
          recipe = this.specifiedRecipes[requirement.item];
        }
        let production = new Production(
          requirement.item,
          recipe,
          requirement.expectedYieldPerMin,
        );
        this.productions.push(production);
        this.byproductions = this.byproductions.concat(
          production.byproducts(this.globalParameters),
        );
        if (!recipe.isMiningRecipe) {
          let materialYPMs = recipe.materialYPM(
            requirement.item,
            requirement.expectedYieldPerMin,
            this.globalParameters,
          );
          for (let material in materialYPMs) {
            this.calculateStack.push({
              item: material,
              expectedYieldPerMin: materialYPMs[material],
            });
          }
        }
      }
    }
  }

  private checkByproduction(requirement: Requirement) {
    if (!this.globalParameters.avoidByproducts) {
      return;
    }
    for (let byproduction of this.byproductions) {
      if (requirement.item == byproduction.targetProduct) {
        if (requirement.expectedYieldPerMin - byproduction.ypm <= 0) {
          let production = new Production(
            requirement.item,
            byproduction.recipe,
            requirement.expectedYieldPerMin,
          );
          this.productions.push(production);
          byproduction.ypm -= requirement.expectedYieldPerMin;
          requirement.expectedYieldPerMin = 0;
          break;
        } else {
          this.productions.push(byproduction);
          _.remove(this.byproductions, (bp) => {
            return bp.id == byproduction.id;
          });
          requirement.expectedYieldPerMin -= byproduction.ypm;
        }
      }
    }
  }

  private addResult(results: DisplayResult[], production: Production) {
    let isResultAdded = false;
    for (let result of results) {
      if (result.mergeProduction(production)) {
        isResultAdded = true;
        break;
      }
    }
    if (isResultAdded == false) {
      let result: DisplayResult = new DisplayResult(production);
      (result.isTarget =
        this.requirements[production.targetProduct] != undefined),
        results.push(result);
    }
  }

  private addConsumption(production: Production) {
    if (production.recipe.calculator != undefined) {
      return;
    }
    let materials = production.recipe.materials;
    if (production.recipe.equivalentRecipe != undefined) {
      materials = production.recipe.equivalentRecipe.materials;
    }
    for (let material in materials) {
      let consumptionPerMin =
        (production.ypm /
          production.recipe.products[production.targetProduct]) *
        production.recipe.materials[material];
      for (let result of this.results) {
        if (result.item == material) {
          if (result.consumptionDetail[production.targetProduct] == undefined) {
            result.consumptionDetail[production.targetProduct] = 0;
          }
          result.consumptionDetail[
            production.targetProduct
          ] += consumptionPerMin;
          break;
        }
      }
    }
  }
}
