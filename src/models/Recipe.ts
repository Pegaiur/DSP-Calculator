import { v4 as uuidv4 } from 'uuid';
import GlobalParameter from './GlobalParameter';
import Building, {
  benchDict,
  miningBuildings,
  processBuildings,
} from './Building';

export default class Recipe implements CompactRecipe {
  recipeID: string;
  products: { [name: string]: number };
  materials: { [name: string]: number };
  time: number;
  building: Building;
  equivalentRecipe?: CompactRecipe;
  calculator?(targetProduct: string, globalParameters: GlobalParameter): number;

  constructor(rawRecipe: RawRecipe) {
    this.recipeID = uuidv4();
    this.products = rawRecipe.products;
    this.materials = rawRecipe.materials;
    this.time = rawRecipe.time;
    this.building = rawRecipe.building;
    this.calculator = rawRecipe.calculator;
    this.equivalentRecipe = rawRecipe.equivalentRecipe;
  }

  recipeYPM(targetProduct: string, globalParameters: GlobalParameter) {
    if (this.calculator != undefined) {
      return this.calculator(targetProduct, globalParameters);
    }
    let time = this.time;
    let products = this.products;
    if (this.equivalentRecipe != undefined) {
      time = this.equivalentRecipe.time;
      products = this.equivalentRecipe.products;
    }
    let basicYPM =
      (60 / time) *
      products[targetProduct] *
      this.building.productionMultiplier;
    return this.isMiningRecipe
      ? basicYPM * (1 + 0.1 * globalParameters.veinsUtilizationLevel)
      : basicYPM;
  }

  materialYPM(
    targetProduct: string,
    expectedYieldPerMin: number,
    globalParameters: GlobalParameter,
  ) {
    let ratio =
      expectedYieldPerMin / this.recipeYPM(targetProduct, globalParameters);
    let materialYPMs: { [name: string]: number } = {};
    let time = this.time;
    let materials = this.materials;
    if (this.equivalentRecipe != undefined) {
      time = this.equivalentRecipe.time;
      materials = this.equivalentRecipe.materials;
    }
    for (let material in materials) {
      let materialYPM = (60 / time) * materials[material] * ratio;
      materialYPMs[material] = materialYPM;
    }
    return materialYPMs;
  }

  buildingCount(
    targetProduct: string,
    expectedYieldPerMin: number,
    globalParameters: GlobalParameter,
  ) {
    let basicCount =
      expectedYieldPerMin / this.recipeYPM(targetProduct, globalParameters);
    if (
      this.isMiningRecipe &&
      this.building != miningBuildings.orbitalCollector
    ) {
      return (
        expectedYieldPerMin /
        this.building.productionMultiplier /
        (1 + 0.1 * globalParameters.veinsUtilizationLevel)
      );
    }
    return basicCount;
  }

  hasProduct(product: string) {
    if (this.equivalentRecipe != undefined) {
      return this.equivalentRecipe.products[product] != undefined;
    }
    return this.products[product] != undefined;
  }

  get processByBench() {
    if (
      this.building == processBuildings.benchMKI ||
      this.building == processBuildings.benchMKII ||
      this.building == processBuildings.benchMKIII
    ) {
      return true;
    }
    return false;
  }

  get isMiningRecipe() {
    return mineralRecipes.indexOf(this) != -1;
  }
}

interface RawRecipe {
  products: { [name: string]: number };
  materials: { [name: string]: number };
  time: number;
  building: Building;
  equivalentRecipe?: CompactRecipe;
  calculator?(targetProduct: string, globalParameters: GlobalParameter): number;
}

export interface CompactRecipe {
  products: { [name: string]: number };
  materials: { [name: string]: number };
  time: number;
}

export function getRecipe(item: string) {
  let availableRecipes: Recipe[] = [];
  recipes.forEach((recipe) => {
    if (recipe.hasProduct(item)) {
      availableRecipes.push(recipe);
    }
  });
  return availableRecipes;
}

export function setGlobalParas(globalParas: GlobalParameter) {
  recipes.forEach((recipe) => {
    if (benchDict[recipe.building.name] != undefined) {
      recipe.building = benchDict[globalParas.defaultBenchType];
    }
  });
}

function orbitalCollectorYPS(
  item: string,
  itemEnergy: { [item: string]: number },
  globalPara: { [item: string]: number },
  veinsUtilizationLevel: number,
) {
  // EPS = Energy Per Second
  const itemEPS =
    globalPara[item] *
    itemEnergy[item] *
    miningBuildings.orbitalCollector.productionMultiplier *
    (1 + 0.1 * veinsUtilizationLevel);
  let totalEPS = 0;
  for (let i in itemEnergy) {
    totalEPS +=
      globalPara[i] *
      itemEnergy[i] *
      miningBuildings.orbitalCollector.productionMultiplier *
      (1 + 0.1 * veinsUtilizationLevel);
  }
  const consumedYPS = ((itemEPS / totalEPS) * 30) / itemEnergy[item];
  let itemYPS =
    globalPara[item] *
    60 *
    miningBuildings.orbitalCollector.productionMultiplier *
    (1 + 0.1 * veinsUtilizationLevel);
  return itemYPS - consumedYPS;
}

const mineralRecipes: Recipe[] = [
  new Recipe({
    products: { 铁矿: 1 },
    materials: { 铁矿脉: 1 },
    time: 1,
    building: miningBuildings.miningMachine,
  }),
  new Recipe({
    products: { 铜矿: 1 },
    materials: { 铜矿脉: 1 },
    time: 1,
    building: miningBuildings.miningMachine,
  }),
  new Recipe({
    products: { 石矿: 1 },
    materials: { 石矿脉: 1 },
    time: 1,
    building: miningBuildings.miningMachine,
  }),
  new Recipe({
    products: { 煤矿: 1 },
    materials: { 煤矿脉: 1 },
    time: 1,
    building: miningBuildings.miningMachine,
  }),
  new Recipe({
    products: { 硅石: 1 },
    materials: { 硅矿脉: 1 },
    time: 1,
    building: miningBuildings.miningMachine,
  }),
  new Recipe({
    products: { 钛石: 1 },
    materials: { 钛矿脉: 1 },
    time: 1,
    building: miningBuildings.miningMachine,
  }),
  new Recipe({
    products: { 水: 1 },
    materials: { 抽水站: 1 },
    time: 1,
    building: miningBuildings.pump,
  }),
  new Recipe({
    products: { 硫酸: 1 },
    materials: { 抽水站: 1 },
    time: 1,
    building: miningBuildings.pump,
  }),
  new Recipe({
    products: { 原油: 1 },
    materials: { 原油涌泉: 1 },
    time: 1,
    building: miningBuildings.oilExtractor,
  }),
  new Recipe({
    products: { 氢: 1, 重氢: 1 },
    materials: { 气态巨行星: 1 },
    time: 1,
    building: miningBuildings.orbitalCollector,
    calculator: (item, globalParas) => {
      const itemEnergy: { [item: string]: number } = { 氢: 8, 重氢: 8 };
      let itemYPS = orbitalCollectorYPS(
        item,
        itemEnergy,
        globalParas.defaultGasGaintYield,
        globalParas.veinsUtilizationLevel,
      );
      return itemYPS;
    },
  }),
  new Recipe({
    products: { 氢: 1, 可燃冰: 1 },
    materials: { 冰巨行星: 1 },
    time: 1,
    building: miningBuildings.orbitalCollector,
    calculator: (item, globalParas) => {
      const itemEnergy: { [item: string]: number } = { 氢: 8, 可燃冰: 4.8 };
      let itemYPS = orbitalCollectorYPS(
        item,
        itemEnergy,
        globalParas.defaultIceGaintYield,
        globalParas.veinsUtilizationLevel,
      );
      return itemYPS;
    },
  }),
  new Recipe({
    products: { 临界光子: 1 },
    materials: { 射线接收站: 1 },
    time: 1,
    building: miningBuildings.rayReceiver,
  }),
  // rare mineral
  new Recipe({
    products: { 分形硅石: 1 },
    materials: { 分形硅矿: 1 },
    time: 1,
    building: miningBuildings.miningMachine,
  }),
  new Recipe({
    products: { 金伯利矿石: 1 },
    materials: { 金伯利矿: 1 },
    time: 1,
    building: miningBuildings.miningMachine,
  }),
  new Recipe({
    products: { 光栅石: 1 },
    materials: { 光栅石矿: 1 },
    time: 1,
    building: miningBuildings.miningMachine,
  }),
  new Recipe({
    products: { 可燃冰: 1 },
    materials: { 可燃冰矿: 1 },
    time: 1,
    building: miningBuildings.miningMachine,
  }),
  new Recipe({
    products: { 刺笋结晶: 1 },
    materials: { 刺笋矿脉: 1 },
    time: 1,
    building: miningBuildings.miningMachine,
  }),
  new Recipe({
    products: { 有机晶体: 1 },
    materials: { 有机晶体矿: 1 },
    time: 1,
    building: miningBuildings.miningMachine,
  }),
  new Recipe({
    products: { 单极磁石: 1 },
    materials: { 单极磁矿: 1 },
    time: 1,
    building: miningBuildings.miningMachine,
  }),
];

export const specialRecipes: Recipe[] = [
  new Recipe({
    products: { 晶格硅: 1 },
    materials: { 分形硅石: 1 },
    time: 4,
    building: processBuildings.benchMKI,
  }),
  new Recipe({
    products: { 金刚石: 1 },
    materials: { 金伯利矿石: 1 },
    time: 2,
    building: processBuildings.refinery,
  }),
  new Recipe({
    products: { 光子合并器: 1 },
    materials: { 光栅石: 1, 电路板: 1 },
    time: 3,
    building: processBuildings.benchMKI,
  }),
  new Recipe({
    products: { 石墨烯: 2, 氢: 1 },
    materials: { 可燃冰: 2 },
    time: 2,
    building: processBuildings.plant,
  }),
  new Recipe({
    products: { 碳纳米管: 2 },
    materials: { 刺笋结晶: 2 },
    time: 4,
    building: processBuildings.plant,
  }),
  new Recipe({
    products: { 卡西米尔晶体: 1 },
    materials: { 光栅石: 6, 石墨烯: 2, 氢: 12 },
    time: 4,
    building: processBuildings.benchMKI,
  }),
  new Recipe({
    products: { 粒子容器: 1 },
    materials: { 铜块: 2, 单极磁石: 10 },
    time: 4,
    building: processBuildings.benchMKI,
  }),
];

export let recipes: Recipe[] = [
  // tier 1
  new Recipe({
    products: { 铁块: 1 },
    materials: { 铁矿: 1 },
    time: 1,
    building: processBuildings.furnace,
  }),
  new Recipe({
    products: { 磁铁: 1 },
    materials: { 铁矿: 1 },
    time: 1.5,
    building: processBuildings.furnace,
  }),
  new Recipe({
    products: { 铜块: 1 },
    materials: { 铜矿: 1 },
    time: 1,
    building: processBuildings.furnace,
  }),
  new Recipe({
    products: { 石材: 1 },
    materials: { 石矿: 1 },
    time: 1,
    building: processBuildings.furnace,
  }),
  new Recipe({
    products: { 玻璃: 1 },
    materials: { 石矿: 2 },
    time: 2,
    building: processBuildings.furnace,
  }),
  new Recipe({
    products: { 高纯硅块: 1 },
    materials: { 硅石: 2 },
    time: 2,
    building: processBuildings.furnace,
  }),
  new Recipe({
    products: { 钛块: 1 },
    materials: { 钛石: 2 },
    time: 2,
    building: processBuildings.furnace,
  }),
  new Recipe({
    products: { 高能石墨: 1 },
    materials: { 煤矿: 2 },
    time: 2,
    building: processBuildings.furnace,
  }),
  new Recipe({
    products: { 精炼油: 2, 氢: 1 },
    materials: { 原油: 2 },
    time: 4,
    building: processBuildings.refinery,
  }),
  new Recipe({
    products: { 高能石墨: 1, 氢: 3 },
    materials: { 精炼油: 1, 氢: 2 },
    time: 4,
    building: processBuildings.refinery,
    equivalentRecipe: {
      products: { 高能石墨: 1, 氢: 1 },
      materials: { 精炼油: 1 },
      time: 4,
    },
  }),
  new Recipe({
    products: { 硅石: 1 },
    materials: { 石矿: 10 },
    time: 10,
    building: processBuildings.furnace,
  }),
  new Recipe({
    products: { 重氢: 0.01, 氢: 0.99 },
    materials: { 氢: 1 },
    time: 100,
    building: processBuildings.fractionator,
    equivalentRecipe: {
      products: { 重氢: 3.6 },
      materials: { 氢: 3.6 },
      time: 60, //普通传送带速度，高速传送带产量*2，极速传送带产量*5
    },
  }),
  new Recipe({
    products: { 重氢: 5 },
    materials: { 氢: 10 },
    time: 5,
    building: processBuildings.collider,
  }),
  new Recipe({
    products: { 反物质: 2, 氢: 2 },
    materials: { 临界光子: 2 },
    time: 2,
    building: processBuildings.collider,
  }),
  // tier 2
  new Recipe({
    products: { 钢材: 1 },
    materials: { 铁块: 3 },
    time: 3,
    building: processBuildings.furnace,
  }),
  new Recipe({
    products: { 齿轮: 1 },
    materials: { 铁块: 1 },
    time: 1,
    building: processBuildings.benchMKI,
  }),
  new Recipe({
    products: { 棱镜: 2 },
    materials: { 玻璃: 3 },
    time: 2,
    building: processBuildings.benchMKI,
  }),
  new Recipe({
    products: { 晶格硅: 1 },
    materials: { 高纯硅块: 1 },
    time: 2,
    building: processBuildings.furnace,
  }),
  new Recipe({
    products: { 金刚石: 1 },
    materials: { 高能石墨: 1 },
    time: 2,
    building: processBuildings.refinery,
  }),
  new Recipe({
    products: { 磁线圈: 2 },
    materials: { 铜块: 1, 磁铁: 2 },
    time: 1,
    building: processBuildings.benchMKI,
  }),
  new Recipe({
    products: { 微晶元件: 1 },
    materials: { 铜块: 1, 高纯硅块: 2 },
    time: 2,
    building: processBuildings.benchMKI,
  }),
  new Recipe({
    products: { 电路板: 2 },
    materials: { 铜块: 1, 铁块: 2 },
    time: 1,
    building: processBuildings.benchMKI,
  }),
  new Recipe({
    products: { 硫酸: 4 },
    materials: { 精炼油: 6, 石矿: 8, 水: 4 },
    time: 6,
    building: processBuildings.plant,
  }),
  new Recipe({
    products: { 液氢燃料棒: 1 },
    materials: { 氢: 5, 钛块: 1 },
    time: 3,
    building: processBuildings.benchMKI,
  }),
  new Recipe({
    products: { 钛化玻璃: 2 },
    materials: { 玻璃: 2, 钛块: 2, 水: 2 },
    time: 5,
    building: processBuildings.benchMKI,
  }),
  new Recipe({
    products: { 塑料: 1 },
    materials: { 精炼油: 2, 高能石墨: 1 },
    time: 3,
    building: processBuildings.plant,
  }),
  new Recipe({
    products: { 能量矩阵: 1 },
    materials: { 高能石墨: 2, 氢: 2 },
    time: 6,
    building: processBuildings.institute,
  }),
  // tier 3
  new Recipe({
    products: { 钛合金: 4 },
    materials: { 硫酸: 8, 钢材: 4, 钛块: 4 },
    time: 12,
    building: processBuildings.furnace,
  }),
  new Recipe({
    products: { 电动机: 1 },
    materials: { 铁块: 2, 齿轮: 1, 磁线圈: 1 },
    time: 2,
    building: processBuildings.benchMKI,
  }),
  new Recipe({
    products: { 光子合并器: 1 },
    materials: { 棱镜: 2, 电路板: 1 },
    time: 3,
    building: processBuildings.benchMKI,
  }),
  new Recipe({
    products: { 电浆激发器: 1 },
    materials: { 磁线圈: 4, 棱镜: 2 },
    time: 2,
    building: processBuildings.benchMKI,
  }),
  new Recipe({
    products: { 地基: 1 },
    materials: { 石材: 3, 钢材: 1 },
    time: 1,
    building: processBuildings.benchMKI,
  }),
  new Recipe({
    products: { 推进器: 1 },
    materials: { 钢材: 2, 铜块: 3 },
    time: 4,
    building: processBuildings.benchMKI,
  }),
  new Recipe({
    products: { 处理器: 1 },
    materials: { 微晶元件: 2, 电路板: 2 },
    time: 3,
    building: processBuildings.benchMKI,
  }),
  new Recipe({
    products: { 石墨烯: 2 },
    materials: { 高能石墨: 3, 硫酸: 1 },
    time: 3,
    building: processBuildings.plant,
  }),
  new Recipe({
    products: { 电磁矩阵: 1 },
    materials: { 磁线圈: 1, 电路板: 1 },
    time: 3,
    building: processBuildings.institute,
  }),
  // tier 4
  new Recipe({
    products: { 有机晶体: 1 },
    materials: { 塑料: 2, 精炼油: 1, 水: 1 },
    time: 6,
    building: processBuildings.plant,
  }),
  new Recipe({
    products: { 电磁涡轮: 1 },
    materials: { 电动机: 2, 磁线圈: 2 },
    time: 2,
    building: processBuildings.benchMKI,
  }),
  new Recipe({
    products: { 物流运输机: 1 },
    materials: { 铁块: 5, 处理器: 2, 推进器: 2 },
    time: 4,
    building: processBuildings.benchMKI,
  }),
  new Recipe({
    products: { 碳纳米管: 2 },
    materials: { 石墨烯: 3, 钛块: 1 },
    time: 4,
    building: processBuildings.plant,
  }),
  new Recipe({
    products: { 卡西米尔晶体: 1 },
    materials: { 钛晶石: 1, 石墨烯: 2, 氢: 12 },
    time: 4,
    building: processBuildings.benchMKI,
  }),
  new Recipe({
    products: { 太阳帆: 2 },
    materials: { 石墨烯: 1, 光子合并器: 1 },
    time: 4,
    building: processBuildings.benchMKI,
  }),
  // tier 5
  new Recipe({
    products: { 加力推进器: 1 },
    materials: { 钛合金: 5, 电磁涡轮: 5 },
    time: 6,
    building: processBuildings.benchMKI,
  }),
  new Recipe({
    products: { 超级磁场环: 1 },
    materials: { 磁铁: 3, 电磁涡轮: 2, 高能石墨: 1 },
    time: 3,
    building: processBuildings.benchMKI,
  }),
  new Recipe({
    products: { 粒子容器: 1 },
    materials: { 铜块: 2, 电磁涡轮: 2, 石墨烯: 2 },
    time: 4,
    building: processBuildings.benchMKI,
  }),
  new Recipe({
    products: { 钛晶石: 1 },
    materials: { 有机晶体: 1, 钛块: 3 },
    time: 4,
    building: processBuildings.benchMKI,
  }),
  new Recipe({
    products: { 粒子宽带: 1 },
    materials: { 碳纳米管: 2, 晶格硅: 2, 塑料: 1 },
    time: 8,
    building: processBuildings.benchMKI,
  }),
  new Recipe({
    products: { 框架材料: 1 },
    materials: { 碳纳米管: 4, 钛合金: 1, 高纯硅块: 1 },
    time: 6,
    building: processBuildings.benchMKI,
  }),
  // tier 6
  new Recipe({
    products: { 氘核燃料棒: 1 },
    materials: { 钛合金: 1, 重氢: 10, 超级磁场环: 1 },
    time: 6,
    building: processBuildings.benchMKI,
  }),
  new Recipe({
    products: { 位面过滤器: 1 },
    materials: { 卡西米尔晶体: 1, 钛化玻璃: 2 },
    time: 12,
    building: processBuildings.benchMKI,
  }),
  new Recipe({
    products: { 星际物流运输船: 1 },
    materials: { 钛合金: 10, 处理器: 10, 加力推进器: 2 },
    time: 6,
    building: processBuildings.benchMKI,
  }),
  new Recipe({
    products: { 奇异物质: 1 },
    materials: { 粒子容器: 2, 铁块: 2, 重氢: 10 },
    time: 8,
    building: processBuildings.collider,
  }),
  new Recipe({
    products: { 湮灭约束球: 1 },
    materials: { 粒子容器: 1, 处理器: 1 },
    time: 20,
    building: processBuildings.benchMKI,
  }),
  new Recipe({
    products: { 戴森球组件: 1 },
    materials: { 框架材料: 3, 太阳帆: 3, 处理器: 3 },
    time: 8,
    building: processBuildings.benchMKI,
  }),
  new Recipe({
    products: { 结构矩阵: 1 },
    materials: { 金刚石: 1, 钛晶石: 1 },
    time: 8,
    building: processBuildings.institute,
  }),
  new Recipe({
    products: { 信息矩阵: 1 },
    materials: { 处理器: 2, 粒子宽带: 1 },
    time: 10,
    building: processBuildings.institute,
  }),
  // tier 7
  new Recipe({
    products: { 量子芯片: 1 },
    materials: { 处理器: 2, 位面过滤器: 2 },
    time: 6,
    building: processBuildings.benchMKI,
  }),
  new Recipe({
    products: { 引力透镜: 1 },
    materials: { 金刚石: 4, 奇异物质: 1 },
    time: 6,
    building: processBuildings.benchMKI,
  }),
  // tier 8
  new Recipe({
    products: { 引力矩阵: 2 },
    materials: { 引力透镜: 1, 量子芯片: 1 },
    time: 24,
    building: processBuildings.institute,
  }),
  new Recipe({
    products: { 小型运载火箭: 1 },
    materials: { 戴森球组件: 2, 氘核燃料棒: 2, 量子芯片: 2 },
    time: 6,
    building: processBuildings.benchMKI,
  }),
  new Recipe({
    products: { 空间翘曲器: 1 },
    materials: { 引力透镜: 1 },
    time: 10,
    building: processBuildings.benchMKI,
  }),
  // tier 9
  new Recipe({
    products: { 宇宙矩阵: 1 },
    materials: {
      引力矩阵: 1,
      信息矩阵: 1,
      结构矩阵: 1,
      能量矩阵: 1,
      电磁矩阵: 1,
      反物质: 1,
    },
    time: 15,
    building: processBuildings.institute,
  }),
];

const buildingRecipes: Recipe[] = [
  new Recipe({
    products: { 传送带: 3 },
    materials: { 铁块: 2, 齿轮: 1 },
    time: 1,
    building: processBuildings.benchMKI,
  }),
  new Recipe({
    products: { 高速传送带: 3 },
    materials: { 传送带: 3, 电磁涡轮: 1 },
    time: 1,
    building: processBuildings.benchMKI,
  }),
  new Recipe({
    products: { 极速传送带: 3 },
    materials: { 高速传送带: 3, 超级磁场环: 1, 石墨烯: 1 },
    time: 1,
    building: processBuildings.benchMKI,
  }),
  new Recipe({
    products: { 分拣器: 1 },
    materials: { 铁块: 1, 电路板: 1 },
    time: 1,
    building: processBuildings.benchMKI,
  }),
  new Recipe({
    products: { 高速分拣器: 2 },
    materials: { 分拣器: 2, 电动机: 1 },
    time: 1,
    building: processBuildings.benchMKI,
  }),
  new Recipe({
    products: { 极速分拣器: 2 },
    materials: { 高速分拣器: 2, 电磁涡轮: 1 },
    time: 1,
    building: processBuildings.benchMKI,
  }),
];

recipes = mineralRecipes
  .concat(specialRecipes)
  .concat(recipes)
  .concat(buildingRecipes);
