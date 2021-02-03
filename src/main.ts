import * as data from './materials.json';

export interface ItemModel {
  name: string;
  time: number;
  yield: number;
  ratePerMin: number;
  yieldPerMin: number;
  isHighEfficiency: boolean;
  materials: Material[];
}

export interface Material {
  name: string;
  quantity: number;
  requiredYieldPerMin: number;
  isMineral: boolean;
}

const allMinerals: { [key: string]: number } = {
  铁矿: 1,
  铜矿: 1,
  石矿: 1,
  煤矿: 1,
  硅石: 1,
  钛石: 1,
};
const jsonItems: ItemModel[] = data.default;
export const allItemNames: string[] = [];
export let allItems: { [key: string]: ItemModel } = {};
jsonItems.map((item) => {
  item.ratePerMin = 60 / item.time;
  item.yieldPerMin = item.ratePerMin * item.yield;
  item.materials.map((material) => {
    material.requiredYieldPerMin = material.quantity * item.ratePerMin;
    material.isMineral = allMinerals[material.name] == 1;
  });
  allItems[item.name] = item;
  allItemNames.push(item.name);
});

export function getMaterial(material: Material) {
  return allItems[material.name];
}

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

export function sumReport(item: ItemModel, expectedYieldPerMin: number) {
  let totalItems: { [key: string]: number } = {};
  item.materials.map((material) => {
    const materialExpectedYieldPerMin =
      (expectedYieldPerMin / item.yieldPerMin) * material.requiredYieldPerMin;
    addResult(totalItems, material.name, materialExpectedYieldPerMin);
    if (material.isMineral == false) {
      const subtotalItems = sumReport(
        getMaterial(material),
        materialExpectedYieldPerMin,
      );
      mergeResult(totalItems, subtotalItems);
    }
  });
  return totalItems;
}
