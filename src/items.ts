const tier0 = [
  '铁矿',
  '铜矿',
  '石矿',
  '煤矿',
  '钛石',
  '水',
  '原油',
  '金伯利矿石',
  '单极磁石',
  '光栅石',
  '可燃冰',
  '刺笋结晶',
  '分形硅石',
  '临界光子',
];
const tier1 = [
  '铁块',
  '磁铁',
  '铜块',
  '石材',
  '玻璃',
  '高纯硅块',
  '钛块',
  '硅石',
  '重氢',
  '氢',
  '高能石墨',
  '精炼油',
  '反物质',
];
const tier2 = [
  '钢材',
  '齿轮',
  '棱镜',
  '晶格硅',
  '金刚石',
  '磁线圈',
  '微晶元件',
  '电路板',
  '硫酸',
  '液氢燃料棒',
  '钛化玻璃',
  '塑料',
  '能量矩阵',
];
const tier3 = [
  '钛合金',
  '电动机',
  '光子合并器',
  '电浆激发器',
  '地基',
  '推进器',
  '处理器',
  '石墨烯',
  '电磁矩阵',
];
const tier4 = [
  '有机晶体',
  '电磁涡轮',
  '物流运输机',
  '碳纳米管',
  '卡西米尔晶体',
  '太阳帆',
];
const tier5 = [
  '加力推进器',
  '超级磁场环',
  '粒子容器',
  '钛晶石',
  '粒子宽带',
  '框架材料',
];
const tier6 = [
  '氘核燃料棒',
  '位面过滤器',
  '星际物流运输船',
  '奇异物质',
  '湮灭约束球',
  '戴森球组件',
  '结构矩阵',
  '信息矩阵',
];
const tier7 = ['量子芯片', '引力透镜', '反物质燃料棒'];
const tier8 = ['引力矩阵', '小型运载火箭', '空间翘曲器'];
const tier9 = ['宇宙矩阵'];

const buildings = [
  '传送带',
  '高速传送带',
  '极速传送带',
  '分拣器',
  '高速分拣器',
  '极速分拣器',
];

export const allItemNames: { [tier: string]: string[] } = {
  物品等级9: tier9,
  物品等级8: tier8,
  物品等级7: tier7,
  物品等级6: tier6,
  物品等级5: tier5,
  物品等级4: tier4,
  物品等级3: tier3,
  物品等级2: tier2,
  物品等级1: tier1,
  物品等级0: tier0,
  建筑: buildings,
};

export let allItemNameArray: string[];

let array: string[] = [];
for (let key in allItemNames) {
  array = array.concat(allItemNames[key]);
}
allItemNameArray = array;
