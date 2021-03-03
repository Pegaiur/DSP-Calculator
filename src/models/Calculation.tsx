import { v4 as uuidv4 } from 'uuid';
import {
  RecipeModel,
  calculateMaterialYPM,
  isMineralRecipe,
  getRecipe,
} from '@/recipes';
import _ from 'lodash';

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
  isTarget?: boolean;
}

interface Requirement {
  item: string;
  expectedYieldPerMin: number;
}

export default class Calculation {
  id: string;
  targetItem: string;
  expectedYieldPerMin: number;
  specifiedRecipes: { [item: string]: RecipeModel };
  results: ResultModel[];
  byproducts: { [item: string]: number };
  private calculateStack: Requirement[];

  constructor(
    targetItem: string,
    expectedYieldPerMin: number,
    specifiedRecipes: { [item: string]: RecipeModel } = {},
  ) {
    this.id = uuidv4();
    this.targetItem = targetItem;
    this.expectedYieldPerMin = expectedYieldPerMin;
    this.specifiedRecipes = specifiedRecipes;
    this.calculateStack = [];

    let results = this.calculate(
      targetItem,
      expectedYieldPerMin,
      specifiedRecipes,
    );
    this.results = results[1];
    this.byproducts = results[0];
  }

  recalculate(expectedValue: number) {
    this.expectedYieldPerMin = expectedValue;
    let results = this.calculate(
      this.targetItem,
      this.expectedYieldPerMin,
      this.specifiedRecipes,
    );
    this.results = results[1];
    this.byproducts = results[0];
  }

  calculateProductions(
    targetProduct: string,
    expectedYieldPerMin: number,
    specifiedRecipes: { [item: string]: RecipeModel },
  ) {
    let productions: ProductionModel[] = [];
    this.calculateStack.push({
      item: targetProduct,
      expectedYieldPerMin: expectedYieldPerMin,
    });
    for (let i = 0; i < this.calculateStack.length; i++) {
      const requirement = this.calculateStack[i];
      let availableRecipes = getRecipe(requirement.item);
      let recipe = availableRecipes[0];
      if (specifiedRecipes[requirement.item] != undefined) {
        recipe = specifiedRecipes[requirement.item];
      }
      if (recipe.equivalentRecipe != undefined) {
        recipe = recipe.equivalentRecipe;
      }
      this.addProduction(
        productions,
        requirement.item,
        recipe,
        requirement.expectedYieldPerMin,
      );
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
    this.calculateStack = [];
    return productions;
  }

  addProduction(
    productions: ProductionModel[],
    targetProduct: string,
    recipe: RecipeModel,
    expectedYieldPerMin: number,
  ) {
    const production: ProductionModel = {
      targetProduct: targetProduct,
      recipe: recipe,
      yieldPerMin: expectedYieldPerMin,
    };
    productions.push(production);
  }

  calculate(
    targetProduct: string,
    expectedYieldPerMin: number,
    specifiedRecipes: { [item: string]: RecipeModel },
  ) {
    let productions = this.calculateProductions(
      targetProduct,
      expectedYieldPerMin,
      specifiedRecipes,
    );
    let results: ResultModel[] = [];
    let byproducts: { [item: string]: number } = {};
    productions.forEach((production) => {
      this.addResult(results, production);
      if (Object.keys(production.recipe.products).length > 1) {
        this.addByproduct(byproducts, production);
      }
    });
    productions.forEach((production) => {
      if (isMineralRecipe(production.recipe) == false) {
        this.addConsumption(results, production);
      }
    });
    let targetResult = _.find(results, (result) => {
      return result.item == this.targetItem;
    });
    targetResult!.isTarget = true;
    let returnValue: [{ [item: string]: number }, ResultModel[]] = [
      byproducts,
      results,
    ];
    return returnValue;
  }

  addResult(results: ResultModel[], production: ProductionModel) {
    let isResultAdded = false;
    for (let result of results) {
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
      };
      results.push(result);
    }
  }

  addConsumption(results: ResultModel[], production: ProductionModel) {
    for (let material in production.recipe.materials) {
      let consumptionPerMin =
        (production.yieldPerMin /
          production.recipe.products[production.targetProduct]) *
        production.recipe.materials[material];
      for (let result of results) {
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

  addByproduct(
    byproducts: { [item: string]: number },
    production: ProductionModel,
  ) {
    for (let product in production.recipe.products) {
      if (product != production.targetProduct) {
        let yieldPerMin =
          (production.yieldPerMin /
            production.recipe.products[production.targetProduct]) *
          production.recipe.products[product];
        if (byproducts[product] == undefined) {
          byproducts[product] = 0;
        }
        byproducts[product] += yieldPerMin;
      }
    }
  }
}
