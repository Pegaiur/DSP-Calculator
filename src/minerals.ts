export interface MineralModel {
  name: string;
  building: Building;
  yieldMultiplier: BuildingMultiplier;
}

enum Building {
  miner = 0,
  pump,
  oilWell,
  gasGiantCollector,
  rayReceiver,
}

enum BuildingMultiplier {
  miner = 30,
  pump = 50,
  oilWell = 1,
  gasGiantCollector = 8,
  rayReceiver = 1,
}

// minerals
export const minerals: { [name: string]: MineralModel } = {
  铁矿: {
    name: '铁矿',
    building: Building.miner,
    yieldMultiplier: BuildingMultiplier.miner,
  },
  铜矿: {
    name: '铜矿',
    building: Building.miner,
    yieldMultiplier: BuildingMultiplier.miner,
  },
  石矿: {
    name: '石矿',
    building: Building.miner,
    yieldMultiplier: BuildingMultiplier.miner,
  },
  煤矿: {
    name: '煤矿',
    building: Building.miner,
    yieldMultiplier: BuildingMultiplier.miner,
  },
  硅石: {
    name: '硅石',
    building: Building.miner,
    yieldMultiplier: BuildingMultiplier.miner,
  },
  钛石: {
    name: '钛石',
    building: Building.miner,
    yieldMultiplier: BuildingMultiplier.miner,
  },
  水: {
    name: '水',
    building: Building.pump,
    yieldMultiplier: BuildingMultiplier.pump,
  },
  原油: {
    name: '原油',
    building: Building.oilWell,
    yieldMultiplier: BuildingMultiplier.oilWell,
  },
  氢: {
    name: '氢',
    building: Building.gasGiantCollector,
    yieldMultiplier: BuildingMultiplier.gasGiantCollector,
  },
  重氢: {
    name: '重氢',
    building: Building.gasGiantCollector,
    yieldMultiplier: BuildingMultiplier.gasGiantCollector,
  },
  临界光子: {
    name: '临界光子',
    building: Building.rayReceiver,
    yieldMultiplier: BuildingMultiplier.rayReceiver,
  },
};

// rare minerals
export const rareMinerlas: { [name: string]: MineralModel } = {
  金伯利矿石: {
    name: '金伯利矿石',
    building: Building.miner,
    yieldMultiplier: BuildingMultiplier.miner,
  },
  分型硅石: {
    name: '分型硅石',
    building: Building.miner,
    yieldMultiplier: BuildingMultiplier.miner,
  },
  光栅石: {
    name: '光栅石',
    building: Building.miner,
    yieldMultiplier: BuildingMultiplier.miner,
  },
  刺笋结晶: {
    name: '刺笋结晶',
    building: Building.miner,
    yieldMultiplier: BuildingMultiplier.miner,
  },
  单极磁石: {
    name: '单极磁石',
    building: Building.miner,
    yieldMultiplier: BuildingMultiplier.miner,
  },
  有机晶体: {
    name: '有机晶体',
    building: Building.miner,
    yieldMultiplier: BuildingMultiplier.miner,
  },
  可燃冰: {
    name: '可燃冰',
    building: Building.miner,
    yieldMultiplier: BuildingMultiplier.miner,
  },
  硫酸: {
    name: '硫酸',
    building: Building.pump,
    yieldMultiplier: BuildingMultiplier.pump,
  },
};
