import {
  RecipeModel,
  getRecipe,
  isMineralRecipe,
  calculateMaterialYPM,
} from '@/recipes';
import _ from 'lodash';
import { allItemNameArray } from '@/items';

export interface GlobalParameter {
  veinsUtilizationLevel: number;
  defaultBenchType: string;
  defaultFractionBeltType: string;
  defaultGasGaintYield: { [item: string]: number };
  defaultIceGaintYield: { [item: string]: number };
}

export interface ProductionModel {
  targetProduct: string;
  recipe: RecipeModel;
  yieldPerMin: number;
}

export interface ResultModel {
  item: string;
  currentRecipe: RecipeModel;
  totalYieldPerMin: number;
  consumptionDetail: { [item: string]: number };
  isTarget: boolean;
}

export interface Requirement {
  item: string;
  expectedYieldPerMin: number;
}

export default class Core {
  globalParameters: GlobalParameter;
  requirements: { [item: string]: number } = {};
  specifiedRecipes: { [item: string]: RecipeModel } = {};

  productions: ProductionModel[] = [];
  results: ResultModel[] = [];
  byproducts: { [item: string]: number } = {};
  private calculateStack: Requirement[] = [];

  constructor(globalParameters: GlobalParameter) {
    this.globalParameters = globalParameters;
  }

  calculate(
    requirements: { [item: string]: number },
    callback: (
      results: ResultModel[],
      byproducts: { [item: string]: number },
    ) => void,
  ) {
    this.requirements = requirements;
    this.calculateProductions();
    this.results = [];
    this.byproducts = {};
    this.productions.forEach((production) => {
      this.addResult(production);
      if (Object.keys(production.recipe.products).length > 1) {
        this.addByproduct(production);
      }
    });
    this.productions.forEach((production) => {
      if (isMineralRecipe(production.recipe) == false) {
        this.addConsumption(production);
      }
    });
    this.results.sort((aResult, bResult) => {
      return (
        allItemNameArray.indexOf(aResult.item) -
        allItemNameArray.indexOf(bResult.item)
      );
    });
    callback(this.results, this.byproducts);
  }

  updateSpecifiedRecipes(
    specifiedRecipes: { [item: string]: RecipeModel },
    callback: (
      results: ResultModel[],
      byproducts: { [item: string]: number },
    ) => void,
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

  private calculateProductions() {
    this.productions = [];
    this.calculateStack = [];
    let requirements = this.requirementsConvert(this.requirements);
    requirements.forEach((requirement) =>
      this.calculateStack.push(requirement),
    );
    for (let i = 0; i < this.calculateStack.length; i++) {
      const requirement = this.calculateStack[i];
      let availableRecipes = getRecipe(requirement.item);
      let recipe = availableRecipes[0];
      if (this.specifiedRecipes[requirement.item] != undefined) {
        recipe = this.specifiedRecipes[requirement.item];
      }
      if (recipe.equivalentRecipe != undefined) {
        recipe = recipe.equivalentRecipe;
      }
      let production: ProductionModel = {
        targetProduct: requirement.item,
        recipe: recipe,
        yieldPerMin: requirement.expectedYieldPerMin,
      };
      this.productions.push(production);
      if (isMineralRecipe(recipe) == false) {
        for (let material in recipe.materials) {
          const materialExpectedYieldPerMin = calculateMaterialYPM(
            requirement.item,
            material,
            recipe,
            requirement.expectedYieldPerMin,
          );
          this.calculateStack.push({
            item: material,
            expectedYieldPerMin: materialExpectedYieldPerMin,
          });
        }
      }
    }
  }

  private addResult(production: ProductionModel) {
    let isResultAdded = false;
    for (let result of this.results) {
      if (result.item == production.targetProduct) {
        result.totalYieldPerMin += production.yieldPerMin;
        isResultAdded = true;
        break;
      }
    }
    if (isResultAdded == false) {
      let result: ResultModel = {
        item: production.targetProduct,
        currentRecipe: production.recipe,
        totalYieldPerMin: production.yieldPerMin,
        consumptionDetail: {},
        isTarget: this.requirements[production.targetProduct] != undefined,
      };
      this.results.push(result);
    }
  }

  private addConsumption(production: ProductionModel) {
    for (let material in production.recipe.materials) {
      let consumptionPerMin =
        (production.yieldPerMin /
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

  private addByproduct(production: ProductionModel) {
    for (let product in production.recipe.products) {
      if (product != production.targetProduct) {
        let yieldPerMin =
          (production.yieldPerMin /
            production.recipe.products[production.targetProduct]) *
          production.recipe.products[product];
        if (this.byproducts[product] == undefined) {
          this.byproducts[product] = 0;
        }
        this.byproducts[product] += yieldPerMin;
      }
    }
  }
}
