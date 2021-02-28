import {
  RecipeModel,
  calculateMaterialYPM,
  isMineralRecipe,
  getRecipe,
  specialRecipes,
} from './recipes';
import { allItemNameArray } from './items';

interface ProductionModel {
  targetProduct: string;
  recipe: RecipeModel;
  yieldPerMin: number;
}

export interface ResultModel {
  item: string;
  currentRecipe: RecipeModel;
  totalYieldPerMin: number;
  consumptionDetail: { [item: string]: number };
}

export interface FlatResultModel {
  targetProduct: string;
  targetMaterial: string;
  yieldPerMin: number;
}

function calculateProductions(
  targetProduct: string,
  expectedYieldPerMin: number,
  specifiedRecipes: { [item: string]: RecipeModel },
  // byproducts: { [item: string]: number } = {}
) {
  let productions: ProductionModel[] = [];
  // if (byproducts[targetProduct] != undefined) {

  // }
  let availableRecipes = getRecipe(targetProduct);
  let recipe = availableRecipes[0];
  if (specifiedRecipes[targetProduct] != undefined) {
    recipe = specifiedRecipes[targetProduct];
  }
  if (recipe.equivalentRecipe != undefined) {
    recipe = recipe.equivalentRecipe;
  }
  addProduction(productions, targetProduct, recipe, expectedYieldPerMin);
  if (isMineralRecipe(recipe) == false) {
    for (let material in recipe.materials) {
      const materialExpectedYieldPerMin = calculateMaterialYPM(
        targetProduct,
        material,
        recipe,
        expectedYieldPerMin,
      );
      const subProductions = calculateProductions(
        material,
        materialExpectedYieldPerMin,
        specifiedRecipes,
      );
      productions = productions.concat(subProductions);
    }
  }

  return productions;
}

function addProduction(
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

export function calculate(
  targetProduct: string,
  expectedYieldPerMin: number,
  specifiedRecipes: { [item: string]: RecipeModel },
) {
  let productions = calculateProductions(
    targetProduct,
    expectedYieldPerMin,
    specifiedRecipes,
  );
  let results: ResultModel[] = [];
  let byproducts: { [item: string]: number } = {};
  productions.forEach((production) => {
    addResult(results, production);
    if (Object.keys(production.recipe.products).length > 1) {
      addByproduct(byproducts, production);
    }
  });
  productions.forEach((production) => {
    if (isMineralRecipe(production.recipe) == false) {
      addConsumption(results, production);
    }
  });
  results.sort((aResult, bResult) => {
    return (
      allItemNameArray.indexOf(aResult.item) -
      allItemNameArray.indexOf(bResult.item)
    );
  });
  let returnValue: [{ [item: string]: number }, ResultModel[]] = [
    byproducts,
    results,
  ];
  return returnValue;
}

function addResult(results: ResultModel[], production: ProductionModel) {
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

function addConsumption(results: ResultModel[], production: ProductionModel) {
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
        result.consumptionDetail[production.targetProduct] += consumptionPerMin;
        break;
      }
    }
  }
}

function addByproduct(
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
