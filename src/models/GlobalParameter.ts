export default interface GlobalParameter {
  veinsUtilizationLevel: number;
  defaultBenchType: string;
  defaultFractionBeltType: string;
  defaultGasGaintYield: { [item: string]: number };
  defaultIceGaintYield: { [item: string]: number };
}

export let defaultGlobalParameter: GlobalParameter = {
  veinsUtilizationLevel: 1,
  defaultBenchType: '制造台MKI',
  defaultFractionBeltType: '传送带',
  defaultGasGaintYield: { 氢: 0.75, 重氢: 0.05 },
  defaultIceGaintYield: { 氢: 0.35, 可燃冰: 0.7 },
};
