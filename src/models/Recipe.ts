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
      let basicYPM =
        (60 / time) * materials[material] * this.building.productionMultiplier;
      materialYPMs[material] = basicYPM * ratio;
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
    if (this.isMiningRecipe) {
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

const mineralRecipes: Recipe[] = [
  new Recipe({
    products: { 异铁矿: 1 },
    materials: { 异铁矿脉: 1 },
    time: 1,
    building: miningBuildings.miningMachine,
  }),
  new Recipe({
    products: { 源矿: 1 },
    materials: { 源矿矿脉: 1 },
    time: 1,
    building: miningBuildings.miningMachine,
  }),
  new Recipe({
    products: { 类晶石: 1 },
    materials: { 类晶石矿脉: 1 },
    time: 1,
    building: miningBuildings.miningMachine,
  }),
  // 种植机
  new Recipe({
    products: { 荞花: 1 },
    materials: { 荞花种子: 1 },
    time: 2,
    building: miningBuildings.farm,
  }),
  new Recipe({
    products: { 柑实: 1 },
    materials: { 柑实种子: 1 },
    time: 2,
    building: miningBuildings.farm,
  }),
  new Recipe({
    products: { 砂叶: 1 },
    materials: { 砂叶种子: 1 },
    time: 2,
    building: miningBuildings.farm,
  }),
];

export let recipes: Recipe[] = [
  // 精炼机
  new Recipe({
    products: { 异铁块: 1 },
    materials: { 异铁矿: 1 },
    time: 4,
    building: processBuildings.refinery,
  }),
  new Recipe({
    products: { 类晶纤维: 1 },
    materials: { 类晶石: 1 },
    time: 4,
    building: processBuildings.refinery,
  }),
  new Recipe({
    products: { 晶体外壳: 1 },
    materials: { 源矿: 1 },
    time: 4,
    building: processBuildings.refinery,
  }),
  new Recipe({
    products: { 碳块: 1 },
    materials: { 荞花: 1 },
    time: 4,
    building: processBuildings.refinery,
  }),
  new Recipe({
    products: { 碳块: 1 },
    materials: { 柑实: 1 },
    time: 4,
    building: processBuildings.refinery,
  }),
  new Recipe({
    products: { 碳粉末: 1 },
    materials: { 砂叶: 1 },
    time: 4,
    building: processBuildings.refinery,
  }),
  new Recipe({
    products: { 碳块: 1 },
    materials: { 植物杂质: 1 },
    time: 4,
    building: processBuildings.refinery,
  }),
  new Recipe({
    products: { 碳粉末: 1 },
    materials: { 荞花粉末: 1 },
    time: 4,
    building: processBuildings.refinery,
  }),
  new Recipe({
    products: { 碳粉末: 1 },
    materials: { 柑实粉末: 1 },
    time: 4,
    building: processBuildings.refinery,
  }),
  new Recipe({
    products: { 碳粉末: 1 },
    materials: { 砂叶粉末: 1 },
    time: 4,
    building: processBuildings.refinery,
  }),
  new Recipe({
    products: { 致密碳粉末: 1 },
    materials: { 细磨荞花粉末: 1 },
    time: 4,
    building: processBuildings.refinery,
  }),
  new Recipe({
    products: { 致密碳粉末: 1 },
    materials: { 细磨柑实粉末: 1 },
    time: 4,
    building: processBuildings.refinery,
  }),
  new Recipe({
    products: { 稳定碳块: 1 },
    materials: { 致密碳粉末: 1 },
    time: 4,
    building: processBuildings.refinery,
  }),
  new Recipe({
    products: { 密制晶体: 1 },
    materials: { 密制晶体粉末: 1 },
    time: 4,
    building: processBuildings.refinery,
  }),
  new Recipe({
    products: { D32钢块: 1 },
    materials: { 致密异铁粉末: 1 },
    time: 4,
    building: processBuildings.refinery,
  }),
  new Recipe({
    products: { 高晶纤维: 1 },
    materials: { 高晶粉末: 1 },
    time: 4,
    building: processBuildings.refinery,
  }),
  new Recipe({
    products: { 密制晶体粉末: 1 },
    materials: { 至纯源石粉末: 1 },
    time: 4,
    building: processBuildings.refinery,
  }),
  // 粉碎机
  new Recipe({
    products: { 异铁粉末: 1 },
    materials: { 异铁块: 1 },
    time: 4,
    building: processBuildings.smasher,
  }),
  new Recipe({
    products: { 类晶粉末: 1 },
    materials: { 类晶纤维: 1 },
    time: 4,
    building: processBuildings.smasher,
  }),
  new Recipe({
    products: { 源石粉末: 1 },
    materials: { 源矿: 1 },
    time: 4,
    building: processBuildings.smasher,
  }),
  new Recipe({
    products: { 碳粉末: 1 },
    materials: { 碳块: 1 },
    time: 4,
    building: processBuildings.smasher,
  }),
  new Recipe({
    products: { 晶体外壳粉末: 1 },
    materials: { 晶体外壳: 1 },
    time: 4,
    building: processBuildings.smasher,
  }),
  new Recipe({
    products: { 荞花粉末: 2 },
    materials: { 荞花: 1 },
    time: 4,
    building: processBuildings.smasher,
  }),
  new Recipe({
    products: { 柑实粉末: 2 },
    materials: { 柑实: 1 },
    time: 4,
    building: processBuildings.smasher,
  }),
  new Recipe({
    products: { 砂叶粉末: 10 },
    materials: { 砂叶: 1 },
    time: 4,
    building: processBuildings.smasher,
  }),
  // 采种机
  new Recipe({
    products: { 荞花种子: 2, 植物杂质: 1 },
    materials: { 荞花: 1 },
    time: 2,
    building: processBuildings.seeder,
  }),
  new Recipe({
    products: { 柑实种子: 2, 植物杂质: 1 },
    materials: { 柑实: 1 },
    time: 2,
    building: processBuildings.seeder,
  }),
  new Recipe({
    products: { 砂叶种子: 2, 植物杂质: 1 },
    materials: { 砂叶: 1 },
    time: 2,
    building: processBuildings.seeder,
  }),
  // 研磨机
  new Recipe({
    products: { 致密异铁粉末: 1 },
    materials: { 异铁粉末: 2, 砂叶粉末: 1 },
    time: 4,
    building: processBuildings.grinder,
  }),
  new Recipe({
    products: { 高晶粉末: 1 },
    materials: { 类晶粉末: 2, 砂叶粉末: 1 },
    time: 4,
    building: processBuildings.grinder,
  }),
  new Recipe({
    products: { 至纯源石粉末: 1 },
    materials: { 源石粉末: 2, 砂叶粉末: 1 },
    time: 4,
    building: processBuildings.grinder,
  }),
  new Recipe({
    products: { 致密碳粉末: 1 },
    materials: { 碳粉末: 2, 砂叶粉末: 1 },
    time: 4,
    building: processBuildings.grinder,
  }),
  new Recipe({
    products: { 致密晶体粉末: 1 },
    materials: { 晶体外壳粉末: 2, 砂叶粉末: 1 },
    time: 4,
    building: processBuildings.grinder,
  }),
  new Recipe({
    products: { 细磨荞花粉末: 1 },
    materials: { 荞花粉末: 2, 砂叶粉末: 1 },
    time: 4,
    building: processBuildings.grinder,
  }),
  new Recipe({
    products: { 细磨柑实粉末: 1 },
    materials: { 柑实粉末: 2, 砂叶粉末: 1 },
    time: 4,
    building: processBuildings.grinder,
  }),
  // 塑形机
  new Recipe({
    products: { 异铁瓶: 1 },
    materials: { 异铁块: 2 },
    time: 4,
    building: processBuildings.shaper,
  }),
  new Recipe({
    products: { 类晶质瓶: 1 },
    materials: { 类晶纤维: 2 },
    time: 4,
    building: processBuildings.shaper,
  }),
  new Recipe({
    products: { 钢质瓶: 1 },
    materials: { D32钢块: 2 },
    time: 4,
    building: processBuildings.shaper,
  }),
  new Recipe({
    products: { 高晶质瓶: 1 },
    materials: { 高晶纤维: 2 },
    time: 4,
    building: processBuildings.shaper,
  }),
  // 灌装机
  new Recipe({
    products: { 真空包装食品: 1 },
    materials: { 柑实粉末: 5, 类晶质瓶: 5 },
    time: 20,
    building: processBuildings.filler,
  }),
  new Recipe({
    products: { 低温罐装食品: 1 },
    materials: { 柑实粉末: 10, 异铁瓶: 5 },
    time: 20,
    building: processBuildings.filler,
  }),
  new Recipe({
    products: { 高温罐装食品: 1 },
    materials: { 细磨柑实粉末: 5, 钢质瓶: 5 },
    time: 20,
    building: processBuildings.filler,
  }),
  new Recipe({
    products: { 一级恢复联剂: 1 },
    materials: { 荞花粉末: 5, 类晶质瓶: 5 },
    time: 20,
    building: processBuildings.filler,
  }),
  new Recipe({
    products: { 二级恢复联剂: 1 },
    materials: { 荞花粉末: 10, 异铁瓶: 5 },
    time: 20,
    building: processBuildings.filler,
  }),
  new Recipe({
    products: { 三级恢复联剂: 1 },
    materials: { 细磨荞花粉末: 5, 钢质瓶: 5 },
    time: 20,
    building: processBuildings.filler,
  }),
  // 配件机
  new Recipe({
    products: { 铁制零件: 1 },
    materials: { 异铁块: 1 },
    time: 4,
    building: processBuildings.processor,
  }),
  new Recipe({
    products: { 类晶零件: 1 },
    materials: { 类晶纤维: 1 },
    time: 4,
    building: processBuildings.processor,
  }),
  new Recipe({
    products: { 钢制零件: 1 },
    materials: { D32钢块: 1 },
    time: 4,
    building: processBuildings.processor,
  }),
  new Recipe({
    products: { 高晶零件: 1 },
    materials: { 高晶纤维: 1 },
    time: 4,
    building: processBuildings.processor,
  }),
  // 嵌造机
  new Recipe({
    products: { 嵌造类晶元件: 1 },
    materials: { 晶体外壳: 1, 类晶纤维: 1 },
    time: 4,
    building: processBuildings.embedder,
  }),
  new Recipe({
    products: { 嵌造高晶元件: 1 },
    materials: { 密制晶体: 1, 高晶纤维: 1 },
    time: 4,
    building: processBuildings.embedder,
  }),
  //封装机
  new Recipe({
    products: { 低容电池: 1 },
    materials: { 类晶零件: 5, 源石粉末: 10 },
    time: 20,
    building: processBuildings.wrapper,
  }),
  new Recipe({
    products: { 中容电池: 1 },
    materials: { 铁制零件: 5, 源石粉末: 20 },
    time: 20,
    building: processBuildings.wrapper,
  }),
  new Recipe({
    products: { 高容电池: 1 },
    materials: { 钢制零件: 5, 至纯源石粉末: 10 },
    time: 20,
    building: processBuildings.wrapper,
  }),
];

recipes = mineralRecipes.concat(recipes);
