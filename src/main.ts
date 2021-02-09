import { RecipeModel, calculateMaterialYPM, getRecipe } from './recipes';
import { allItemNameArray } from './items';
import ResultList from './components/ResultList';
// import { minerals } from './minerals';

export interface ResultModel {
  targetProduct: string;
  targetMaterial?: string;
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
      addResult(results, material, recipe, materialExpectedYieldPerMin, item); // result for item consumption detail
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
  targetProduct?: string, // information for item consumption detail
) {
  let resultAdded = false;
  if (results[item] != undefined) {
    // in case of hydrogen production
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
    if (targetProduct != undefined) {
      result = {
        targetProduct: targetProduct,
        targetMaterial: item,
        recipe: recipe,
        yieldPerMin: expectedYieldPerMin,
      };
    }
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
      if (result.targetMaterial != undefined) {
        addResult(
          results,
          result.targetMaterial,
          result.recipe,
          result.yieldPerMin,
          result.targetProduct,
        );
      } else {
        addResult(results, item, result.recipe, result.yieldPerMin);
      }
    });
  }
}

export function flattenResults(results: ResultModel[]) {
  let productions: FlatResultModel[] = [];
  let consumptions: FlatResultModel[] = [];
  results.forEach((result) => {
    if (result.targetMaterial != undefined) {
      let flatResult: FlatResultModel = {
        targetProduct: result.targetProduct,
        targetMaterial: result.targetMaterial,
        yieldPerMin: result.yieldPerMin,
      };
      consumptions.push(flatResult);
    } else {
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
    }
  });
  return [consumptions, productions];
}

export function getTargetItem(results: ResultModel[]) {
  for (let result of results) {
    if (result.targetMaterial == undefined) {
      return result;
    }
  }
}
