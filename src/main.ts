import * as data from './materials.json';

const allMinerals: { [key: string]: number } = {
  铁矿: 1,
  铜矿: 1,
  石矿: 1,
  煤矿: 1,
  硅石: 1,
  钛石: 1,
};
const jsonItems: ItemModel[] = data.default;
let allItems: { [key: string]: ItemModel } = {};
jsonItems.map((item) => {
  item.ratePerMin = item.yieldPerMin / item.yield;
  item.materials.map((material) => {
    material.requiredYieldPerMin = material.quantity * item.ratePerMin;
    material.isMineral = allMinerals[material.name] == 1;
  });
  allItems[item.name] = item;
});

export interface ItemModel {
  name: string;
  yieldPerMin: number;
  yield: number;
  ratePerMin: number;
  isHighEfficiency: boolean;
  materials: Material[];
}

export interface Material {
  name: string;
  quantity: number;
  requiredYieldPerMin: number;
  isMineral: boolean;
}

export class ResultModel {
  constructor() {
    let results: { [key: string]: number } = {};

    function addResult(name: string, quantity: number) {
      if (results[name] == undefined) {
        results[name] = 0;
      }
      results[name] += quantity;
    }

    function mergeResult(resultToMerge: ResultModel) {
      // for (let materialName in resultToMerge.results) {
      //   this.addResult(materialName, resultToMerge.results[materialName])
      // }
    }
  }
}

export const testObject = allItems['电磁涡轮'];

export function getMaterial(material: Material) {
  return allItems[material.name];
}

export function sumReport(item: ItemModel, expectedYieldPerMin: number) {
  let totalItems: { [key: string]: number } = {};
  item.materials.map((material) => {
    const materialExpectedYieldPerMin =
      (expectedYieldPerMin / item.yieldPerMin) * material.requiredYieldPerMin;
    if (totalItems[material.name] == undefined) {
      totalItems[material.name] = 0;
    }
    totalItems[material.name] += materialExpectedYieldPerMin;
    if (material.isMineral == false) {
      const subtotalItems = sumReport(
        getMaterial(material),
        materialExpectedYieldPerMin,
      );
      for (let subMaterialName in subtotalItems) {
        if (totalItems[subMaterialName] == undefined) {
          totalItems[subMaterialName] = 0;
        }
        totalItems[subMaterialName] += subtotalItems[subMaterialName];
      }
    }
  });
  return totalItems;
}
