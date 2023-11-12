const tier0 = ['异铁矿', '类晶石', '源矿', '荞花', '柑实', '砂叶'];
const tier1 = [
  '异铁块',
  '类晶纤维',
  '晶体外壳',
  '碳块',
  '碳粉末',
  '源石粉末',
  '荞花粉末',
  '柑实粉末',
  '砂叶粉末',
  '荞花种子',
  '柑实种子',
  '砂叶种子',
  '植物杂质',
];
const tier2 = [
  '异铁粉末',
  '类晶粉末',
  '晶体外壳粉末',
  '异铁瓶',
  '类晶质瓶',
  '铁制零件',
  '类晶零件',
  '至纯源石粉末',
  '致密碳粉末',
  '细磨荞花粉末',
  '细磨柑实粉末',
  '嵌造类晶元件',
];
const tier3 = [
  '致密碳粉末',
  '密制晶体粉末',
  '致密异铁粉末',
  '高晶粉末',
  '致密晶体粉末',
  '真空包装食品',
  '低温罐装食品',
  '一级恢复联剂',
  '二级恢复联剂',
  '低容电池',
  '中容电池',
];
const tier4 = ['稳定碳块', '密制晶体', 'D32钢块', '高晶纤维'];
const tier5 = ['钢制零件', '高晶零件', '嵌造高晶元件', '钢质瓶', '高晶质瓶'];
const tier6 = ['高温罐装食品', '三级恢复联剂', '高容电池'];

export const allItemNames: { [tier: string]: string[] } = {
  物品等级6: tier6,
  物品等级5: tier5,
  物品等级4: tier4,
  物品等级3: tier3,
  物品等级2: tier2,
  物品等级1: tier1,
  物品等级0: tier0,
};

export let allItemNameArray: string[];

let array: string[] = [];
for (let key in allItemNames) {
  array = array.concat(allItemNames[key]);
}
allItemNameArray = array;
