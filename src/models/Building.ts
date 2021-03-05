interface AllProcessBuilding extends Object {
  benchMKI: Building;
  benchMKII: Building;
  benchMKIII: Building;
  furnace: Building;
  plant: Building;
  refinery: Building;
  fractionator: Building;
  collider: Building;
  institute: Building;
}

interface AllMiningBuilding extends Object {
  miningMachine: Building;
  pump: Building;
  oilExtractor: Building;
  orbitalCollector: Building;
  rayReceiver: Building;
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
    this.powerMW = this.powerKW / 1000;
  }
}

export const processBuildings: AllProcessBuilding = {
  benchMKI: new Building('制造台MKI', 0.75, 270),
  benchMKII: new Building('制造台MKII', 1, 380),
  benchMKIII: new Building('制造台MKIII', 1.5, 270),
  furnace: new Building('电弧熔炉', 1, 360),
  plant: new Building('化工厂', 1, 720),
  refinery: new Building('原油精炼厂', 1, 960),
  fractionator: new Building('分馏塔', 1, 720),
  collider: new Building('微型粒子对撞机', 1, 12000),
  institute: new Building('矩阵研究站', 1, 480),
};

export const miningBuildings: AllMiningBuilding = {
  miningMachine: new Building('采矿机', 30, 420),
  pump: new Building('抽水站', 50, 300),
  oilExtractor: new Building('原油萃取站', 1, 840),
  orbitalCollector: new Building('轨道采集器', 8, 0),
  rayReceiver: new Building('射线接收站', 1, 0),
};

export const benchDict: { [name: string]: Building } = {
  制造台MKI: processBuildings.benchMKI,
  制造台MKII: processBuildings.benchMKII,
  制造台MKIII: processBuildings.benchMKIII,
};
