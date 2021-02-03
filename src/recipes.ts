import { minerals } from './minerals';

export interface RecipeModel {
  products: { [name: string]: number };
  materials: { [name: string]: number };
  time: number;
  building: ProcessBuilding;
}

enum ProcessBuilding {
  bench = 0, //合成台
  furnace, //电弧熔炉
  plant, //化工厂
  refinery, //原油精炼厂
  fractionatingTower, //分馏塔
  collider, //粒子对撞机
  institute, //研究站
}

export function calculateMaterialRequirements(
  recipe: RecipeModel,
  targetProduct: string,
  targetMaterial: string,
  expectedYieldPerMin: number,
) {
  const rate = 60 / recipe.time;
  const yieldPerMin = rate * recipe.products[targetProduct];
  return (
    (expectedYieldPerMin / yieldPerMin) *
    recipe.materials[targetMaterial] *
    rate
  );
}

// high efficiency recipes
export const specialRecipes: RecipeModel[] = [
  {
    products: { 晶格硅: 1 },
    materials: { 分型硅石: 1 },
    time: 4,
    building: ProcessBuilding.refinery,
  },
  {
    products: { 金刚石: 1 },
    materials: { 金伯利矿石: 1 },
    time: 2,
    building: ProcessBuilding.refinery,
  },
  {
    products: { 光子合并器: 1 },
    materials: { 光栅石: 1, 电路板: 1 },
    time: 3,
    building: ProcessBuilding.bench,
  },
  {
    products: { 石墨烯: 2, 氢: 1 },
    materials: { 可燃冰: 2 },
    time: 2,
    building: ProcessBuilding.plant,
  },
  {
    products: { 碳纳米管: 2 },
    materials: { 刺笋结晶: 2 },
    time: 4,
    building: ProcessBuilding.plant,
  },
  {
    products: { 卡西米尔晶体: 1 },
    materials: { 光栅石: 6, 石墨烯: 2, 氢: 12 },
    time: 4,
    building: ProcessBuilding.bench,
  },
  {
    products: { 粒子容器: 1 },
    materials: { 铜块: 2, 单极磁石: 10 },
    time: 4,
    building: ProcessBuilding.bench,
  },
];

// normal recipes
export const recipes: RecipeModel[] = [
  // tier 1
  {
    products: { 铁块: 1 },
    materials: { 铁矿: 1 },
    time: 1,
    building: ProcessBuilding.furnace,
  },
  {
    products: { 磁铁: 1 },
    materials: { 铁矿: 1.5 },
    time: 1,
    building: ProcessBuilding.furnace,
  },
  {
    products: { 铜块: 1 },
    materials: { 铜矿: 1 },
    time: 1,
    building: ProcessBuilding.furnace,
  },
  {
    products: { 石材: 1 },
    materials: { 石矿: 1 },
    time: 1,
    building: ProcessBuilding.furnace,
  },
  {
    products: { 玻璃: 1 },
    materials: { 石矿: 2 },
    time: 2,
    building: ProcessBuilding.furnace,
  },
  {
    products: { 高纯硅块: 1 },
    materials: { 硅石: 2 },
    time: 2,
    building: ProcessBuilding.furnace,
  },
  {
    products: { 钛块: 1 },
    materials: { 钛石: 2 },
    time: 2,
    building: ProcessBuilding.furnace,
  },
  {
    products: { 高能石墨: 1 },
    materials: { 煤矿: 2 },
    time: 2,
    building: ProcessBuilding.furnace,
  },
  {
    products: { 精炼油: 2, 氢: 1 },
    materials: { 原油: 2 },
    time: 4,
    building: ProcessBuilding.refinery,
  },
  {
    products: { 高能石墨: 1, 氢: 3 },
    materials: { 原油: 1, 氢: 2 },
    time: 4,
    building: ProcessBuilding.refinery,
  },
  {
    products: { 硅石: 1 },
    materials: { 石矿: 10 },
    time: 10,
    building: ProcessBuilding.refinery,
  },
  {
    products: { 重氢: 1 },
    materials: { 氢: 1 },
    time: 0, //根据传送带速度决定
    building: ProcessBuilding.fractionatingTower,
  },
  {
    products: { 重氢: 5 },
    materials: { 氢: 10 },
    time: 5,
    building: ProcessBuilding.collider,
  },
  {
    products: { 反物质: 2, 氢: 2 },
    materials: { 临界光子: 2 },
    time: 2,
    building: ProcessBuilding.collider,
  },
  // tier 2
  {
    products: { 钢材: 1 },
    materials: { 铁块: 3 },
    time: 3,
    building: ProcessBuilding.refinery,
  },
  {
    products: { 齿轮: 1 },
    materials: { 铁块: 1 },
    time: 1,
    building: ProcessBuilding.bench,
  },
  {
    products: { 棱镜: 2 },
    materials: { 玻璃: 3 },
    time: 2,
    building: ProcessBuilding.bench,
  },
  {
    products: { 晶格硅: 1 },
    materials: { 高纯硅块: 1 },
    time: 2,
    building: ProcessBuilding.refinery,
  },
  {
    products: { 金刚石: 1 },
    materials: { 高能石墨: 1 },
    time: 2,
    building: ProcessBuilding.refinery,
  },
  {
    products: { 磁线圈: 2 },
    materials: { 铜块: 1, 磁铁: 2 },
    time: 1,
    building: ProcessBuilding.bench,
  },
  {
    products: { 微晶元件: 1 },
    materials: { 铜块: 1, 高纯硅块: 2 },
    time: 2,
    building: ProcessBuilding.bench,
  },
  {
    products: { 电路板: 2 },
    materials: { 铜块: 1, 铁块: 2 },
    time: 1,
    building: ProcessBuilding.bench,
  },
  {
    products: { 微晶元件: 1 },
    materials: { 铜块: 1, 高纯硅块: 2 },
    time: 2,
    building: ProcessBuilding.bench,
  },
  {
    products: { 硫酸: 4 },
    materials: { 精炼油: 6, 石矿: 8, 水: 4 },
    time: 6,
    building: ProcessBuilding.plant,
  },
  {
    products: { 液氢燃料棒: 1 },
    materials: { 氢: 5, 钛块: 1 },
    time: 3,
    building: ProcessBuilding.bench,
  },
  {
    products: { 钛化玻璃: 2 },
    materials: { 玻璃: 2, 钛块: 2, 水: 2 },
    time: 5,
    building: ProcessBuilding.bench,
  },
  {
    products: { 塑料: 1 },
    materials: { 精炼油: 2, 高能石墨: 1 },
    time: 3,
    building: ProcessBuilding.plant,
  },
  {
    products: { 能量矩阵: 1 },
    materials: { 高能石墨: 2, 氢: 2 },
    time: 6,
    building: ProcessBuilding.institute,
  },
  // tier 3
  {
    products: { 钛合金: 4 },
    materials: { 硫酸: 8, 钢材: 4, 钛块: 4 },
    time: 12,
    building: ProcessBuilding.furnace,
  },
  {
    products: { 电动机: 1 },
    materials: { 铁块: 2, 齿轮: 1, 磁线圈: 1 },
    time: 2,
    building: ProcessBuilding.bench,
  },
  {
    products: { 光子合并器: 1 },
    materials: { 棱镜: 2, 电路板: 1 },
    time: 3,
    building: ProcessBuilding.bench,
  },
  {
    products: { 电浆激发器: 1 },
    materials: { 磁线圈: 4, 棱镜: 2 },
    time: 2,
    building: ProcessBuilding.bench,
  },
  {
    products: { 地基: 1 },
    materials: { 石材: 3, 钢材: 1 },
    time: 1,
    building: ProcessBuilding.bench,
  },
  {
    products: { 推进器: 1 },
    materials: { 钢材: 2, 铜块: 3 },
    time: 4,
    building: ProcessBuilding.bench,
  },
  {
    products: { 处理器: 1 },
    materials: { 微晶元件: 2, 电路板: 2 },
    time: 3,
    building: ProcessBuilding.bench,
  },
  {
    products: { 石墨烯: 2 },
    materials: { 高能石墨: 3, 硫酸: 1 },
    time: 3,
    building: ProcessBuilding.plant,
  },
  {
    products: { 电磁矩阵: 1 },
    materials: { 磁线圈: 1, 电路板: 1 },
    time: 3,
    building: ProcessBuilding.institute,
  },
  // tier 4
  {
    products: { 有机晶体: 1 },
    materials: { 塑料: 2, 精炼油: 1, 水: 1 },
    time: 6,
    building: ProcessBuilding.plant,
  },
  {
    products: { 电磁涡轮: 1 },
    materials: { 电动机: 2, 磁线圈: 2 },
    time: 2,
    building: ProcessBuilding.bench,
  },
  {
    products: { 物流运输机: 1 },
    materials: { 铁块: 5, 处理器: 2, 推进器: 2 },
    time: 4,
    building: ProcessBuilding.bench,
  },
  {
    products: { 碳纳米管: 2 },
    materials: { 石墨烯: 3, 钛块: 1 },
    time: 4,
    building: ProcessBuilding.plant,
  },
  {
    products: { 卡西米尔晶体: 1 },
    materials: { 钛晶石: 1, 石墨烯: 2, 氢: 12 },
    time: 4,
    building: ProcessBuilding.bench,
  },
  {
    products: { 太阳帆: 2 },
    materials: { 石墨烯: 1, 光子合并器: 1 },
    time: 4,
    building: ProcessBuilding.bench,
  },
  // tier 5
  {
    products: { 加力推进器: 1 },
    materials: { 钛合金: 5, 电磁涡轮: 5 },
    time: 6,
    building: ProcessBuilding.bench,
  },
  {
    products: { 超级磁场环: 1 },
    materials: { 磁铁: 3, 电磁涡轮: 2, 高能石墨: 1 },
    time: 3,
    building: ProcessBuilding.bench,
  },
  {
    products: { 粒子容器: 1 },
    materials: { 铜块: 2, 电磁涡轮: 2, 石墨烯: 2 },
    time: 4,
    building: ProcessBuilding.bench,
  },
  {
    products: { 钛晶石: 1 },
    materials: { 有机晶体: 1, 钛块: 3 },
    time: 4,
    building: ProcessBuilding.bench,
  },
  {
    products: { 粒子宽带: 1 },
    materials: { 碳纳米管: 2, 晶格硅: 2, 塑料: 1 },
    time: 8,
    building: ProcessBuilding.bench,
  },
  {
    products: { 框架材料: 1 },
    materials: { 碳纳米管: 2, 钛合金: 1, 石高纯硅块: 1 },
    time: 6,
    building: ProcessBuilding.bench,
  },
  // tier 6
  {
    products: { 氘核燃料棒: 1 },
    materials: { 钛合金: 1, 重氢: 10, 电磁涡轮: 1 },
    time: 6,
    building: ProcessBuilding.bench,
  },
  {
    products: { 位面过滤器: 1 },
    materials: { 卡西米尔晶体: 1, 钛化玻璃: 2 },
    time: 12,
    building: ProcessBuilding.bench,
  },
  {
    products: { 星际物流运输船: 1 },
    materials: { 钛合金: 10, 处理器: 10, 加力推进器: 2 },
    time: 6,
    building: ProcessBuilding.bench,
  },
  {
    products: { 奇异物质: 1 },
    materials: { 粒子容器: 2, 铁块: 2, 重氢: 10 },
    time: 8,
    building: ProcessBuilding.collider,
  },
  {
    products: { 湮灭约束球: 1 },
    materials: { 粒子容器: 1, 处理器: 1 },
    time: 20,
    building: ProcessBuilding.bench,
  },
  {
    products: { 戴森球组件: 1 },
    materials: { 框架材料: 3, 太阳帆: 3, 处理器: 3 },
    time: 8,
    building: ProcessBuilding.bench,
  },
  {
    products: { 结构矩阵: 1 },
    materials: { 金刚石: 1, 钛晶石: 1 },
    time: 8,
    building: ProcessBuilding.institute,
  },
  {
    products: { 信息矩阵: 1 },
    materials: { 处理器: 2, 粒子宽带: 1 },
    time: 10,
    building: ProcessBuilding.institute,
  },
  // tier 7
  {
    products: { 量子芯片: 1 },
    materials: { 处理器: 2, 位面过滤器: 2 },
    time: 6,
    building: ProcessBuilding.bench,
  },
  {
    products: { 引力透镜: 1 },
    materials: { 金刚石: 4, 奇异物质: 1 },
    time: 6,
    building: ProcessBuilding.bench,
  },
  // tier 8
  {
    products: { 引力矩阵: 2 },
    materials: { 引力透镜: 1, 量子芯片: 1 },
    time: 24,
    building: ProcessBuilding.institute,
  },
  {
    products: { 小型运载火箭: 1 },
    materials: { 戴森球组件: 2, 氘核燃料棒: 2, 量子芯片: 2 },
    time: 6,
    building: ProcessBuilding.bench,
  },
  {
    products: { 空间翘曲器: 1 },
    materials: { 引力透镜: 1 },
    time: 10,
    building: ProcessBuilding.bench,
  },
  // tier 9
  {
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
    building: ProcessBuilding.institute,
  },
];

export const buildingRecipes: RecipeModel[] = [
  {
    products: { 传送带: 3 },
    materials: { 铁块: 2, 齿轮: 1 },
    time: 1,
    building: ProcessBuilding.bench,
  },
  {
    products: { 高速传送带: 3 },
    materials: { 传送带: 3, 电磁涡轮: 1 },
    time: 1,
    building: ProcessBuilding.bench,
  },
  {
    products: { 极速传送带: 3 },
    materials: { 高速传送带: 3, 超级磁场环: 1, 石墨烯: 1 },
    time: 1,
    building: ProcessBuilding.bench,
  },
  {
    products: { 分拣器: 1 },
    materials: { 铁块: 1, 电路板: 1 },
    time: 1,
    building: ProcessBuilding.bench,
  },
  {
    products: { 高速分拣器: 2 },
    materials: { 分拣器: 2, 电动机: 1 },
    time: 1,
    building: ProcessBuilding.bench,
  },
  {
    products: { 极速分拣器: 2 },
    materials: { 高速分拣器: 2, 电磁涡轮: 1 },
    time: 1,
    building: ProcessBuilding.bench,
  },
];
