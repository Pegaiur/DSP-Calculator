export default interface GlobalParameter extends Object {
  veinsUtilizationLevel: number;
  defaultBenchType: string;
  defaultFractionBeltType: string;
  defaultGasGaintYield: { [item: string]: number };
  defaultIceGaintYield: { [item: string]: number };
  avoidByproducts: boolean;
}

export let defaultGlobalParameter: GlobalParameter = {
  veinsUtilizationLevel: 0,
  defaultBenchType: '制造台MKI',
  defaultFractionBeltType: '传送带',
  defaultGasGaintYield: { 氢: 0.75, 重氢: 0.05 },
  defaultIceGaintYield: { 氢: 0.35, 可燃冰: 0.7 },
  avoidByproducts: true,
};

export const fractionatorBeltDict: { [belt: string]: number } = {
  传送带: 1,
  高速传送带: 2,
  极速传送带: 5,
};
