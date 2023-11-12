interface AllProcessBuilding extends Object {
  benchMKI: Building;
  benchMKII: Building;
  benchMKIII: Building;
  refinery: Building;
  smasher: Building;
  grinder: Building;
  seeder: Building;
  filler: Building;
  processor: Building;
  embedder: Building;
  shaper: Building;
  wrapper: Building;
}

interface AllMiningBuilding extends Object {
  miningMachine: Building;
  farm: Building;
}

export default class Building {
  name: string;
  productionMultiplier: number;
  powerKW: number;
  powerMW: number;

  constructor(name: string, productionMultiplier: number, powerKW: number) {
    this.name = name;
    this.productionMultiplier = productionMultiplier;
    this.powerKW = powerKW;
    this.powerMW = this.powerKW;
  }
}

export const processBuildings: AllProcessBuilding = {
  benchMKI: new Building('制造台MKI', 0.75, 270),
  benchMKII: new Building('制造台MKII', 1, 380),
  benchMKIII: new Building('制造台MKIII', 1.5, 270),
  refinery: new Building('精炼炉', 1, 5),
  smasher: new Building('粉碎机', 1, 10),
  grinder: new Building('研磨机', 1, 20),
  seeder: new Building('采种机', 1, 10),
  filler: new Building('灌装机', 1, 10),
  processor: new Building('配件机', 1, 10),
  embedder: new Building('嵌造机', 1, 10),
  shaper: new Building('塑形机', 1, 10),
  wrapper: new Building('封装机', 1, 30),
};

export const miningBuildings: AllMiningBuilding = {
  miningMachine: new Building('电驱矿机', 10, 2),
  farm: new Building('种植机', 30, 10), // 等效计算1倍效率制造
};

export const benchDict: { [name: string]: Building } = {
  制造台MKI: processBuildings.benchMKI,
  制造台MKII: processBuildings.benchMKII,
  制造台MKIII: processBuildings.benchMKIII,
};
