import { RecipeModel, calculateMaterialYPM, getRecipe } from './recipes';
import { allItemNameArray } from './items';
// import { minerals } from './minerals';

export interface ResultModel {
  targetProduct: string;
  recipe: RecipeModel;
  yieldPerMin: number;
}

export interface FlatResultModel {
  targetProduct: string;
  targetMaterial: string;
  yieldPerMin: number;
}

export function calculateResults(item: string, expectedYieldPerMin: number) {
  let results: { [item: string]: ResultModel[] } = {};
  // TODO: selectable recipe
  let recipe = getRecipe(item)[0];
  addResult(results, item, recipe, expectedYieldPerMin);
  if (recipe.materials != {}) {
    for (let material in recipe.materials) {
      const materialExpectedYieldPerMin = calculateMaterialYPM(
        item,
        material,
        recipe,
        expectedYieldPerMin,
      );
      const subResults = calculateResults(
        material,
        materialExpectedYieldPerMin,
      );
      mergeResults(results, subResults);
    }
  }
  return results;
}

function addResult(
  results: { [item: string]: ResultModel[] },
  item: string,
  recipe: RecipeModel,
  expectedYieldPerMin: number,
) {
  let resultAdded = false;
  if (results[item] != undefined) {
    results[item].forEach((result) => {
      if (result.recipe == recipe) {
        result.yieldPerMin += expectedYieldPerMin;
        resultAdded = true;
      }
    });
  }
  if (resultAdded == false) {
    let result: ResultModel = {
      targetProduct: item,
      recipe: recipe,
      yieldPerMin: expectedYieldPerMin,
    };
    if (results[item] == undefined) {
      results[item] = [];
    }
    results[item].push(result);
  }
}

function mergeResults(
  results: { [item: string]: ResultModel[] },
  resultsToMerge: { [item: string]: ResultModel[] },
) {
  for (let item in resultsToMerge) {
    resultsToMerge[item].forEach((result) => {
      addResult(results, item, result.recipe, result.yieldPerMin);
    });
  }
}

export function flattenResults(results: ResultModel[]) {
  let productions: FlatResultModel[] = [];
  let consumptions: FlatResultModel[] = [];
  results.forEach((result) => {
    Object.keys(result.recipe.products).forEach((product) => {});
    Object.keys(result.recipe.materials).forEach((material) => {
      let flatResult: FlatResultModel = {
        targetProduct: result.targetProduct,
        targetMaterial: material,
        yieldPerMin: calculateMaterialYPM(
          result.targetProduct,
          material,
          result.recipe,
          result.yieldPerMin,
        ),
      };
      productions.push(flatResult);
    });
  });
  return productions;
}
