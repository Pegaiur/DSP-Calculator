import { RecipeModel, recipes, calculateMaterialRequirements } from './recipes';
import { minerals } from './minerals';

// export let allItems: { [key: string]: ItemModel } = {};
// jsonItems.map((item) => {
//   item.ratePerMin = 60 / item.time;
//   item.yieldPerMin = item.ratePerMin * item.yield;
//   item.materials.map((material) => {
//     material.requiredYieldPerMin = material.quantity * item.ratePerMin;
//     material.isMineral = allMinerals[material.name] == 1;
//   });
//   allItems[item.name] = item;
//   allItemNames.push(item.name);
// });

// export function getMaterial(material: Material) {
//   return allItems[material.name];
// }

function addResult(
  results: { [key: string]: number },
  name: string,
  quantity: number,
) {
  if (results[name] == undefined) {
    results[name] = 0;
  }
  results[name] += quantity;
}

function mergeResult(
  results: { [key: string]: number },
  resultsToMerge: { [key: string]: number },
) {
  for (let name in resultsToMerge) {
    addResult(results, name, resultsToMerge[name]);
  }
}

export function sumReport(item: string, expectedYieldPerMin: number) {
  let totalItems: { [key: string]: number } = {};
  let availableRecipes: RecipeModel[] = [];
  recipes.map((recipe) => {
    if (recipe.products[item] != undefined) {
      availableRecipes.push(recipe);
    }
  });
  if (availableRecipes.length == 0) {
    const mineral = minerals[item];
    addResult(totalItems, item, expectedYieldPerMin);
  } else {
    for (let material in availableRecipes[0].materials) {
      const materialExpectedYieldPerMin = calculateMaterialRequirements(
        availableRecipes[0],
        item,
        material,
        expectedYieldPerMin,
      );
      addResult(totalItems, material, materialExpectedYieldPerMin);
      if (minerals[material] == undefined) {
        const subtotalItems = sumReport(material, materialExpectedYieldPerMin);
        mergeResult(totalItems, subtotalItems);
      }
    }
  }
  return totalItems;
}
