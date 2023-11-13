import { v4 as uuidv4 } from 'uuid';
import Recipe, { getRecipe, recipes } from '@/models/Recipe';
import _ from 'lodash';
import GlobalParameter, {
  fractionatorBeltDict,
} from '@/models/GlobalParameter';
import Production from './Production';
import { miningBuildings, processBuildings } from './Building';

export default class DisplayResult {
  id: string;
  key: string;
  item: string;
  recipe: Recipe;
  ypm: number;
  consumptionDetail: { [item: string]: number } = {};
  isTarget: boolean = false;

  constructor(production: Production) {
    this.id = uuidv4();
    this.key = this.id;
    this.item = production.targetProduct;
    this.recipe = production.recipe;
    this.ypm = production.ypm;
  }

  mergeProduction(production: Production) {
    if (
      production.targetProduct == this.item &&
      production.recipe == this.recipe
    ) {
      this.ypm += production.ypm;
      return true;
    }
    return false;
  }

  buildings(globalParas: GlobalParameter): [string, number] {
    let count = this.recipe.buildingCount(this.item, this.ypm, globalParas);
    let building: string = this.recipe.building.name;
    if (
      this.recipe.building == miningBuildings.miningMachine ||
      this.recipe.building == miningBuildings.oilExtractor
    ) {
      building = Object.keys(this.recipe.materials)[0];
    }
    if (this.recipe.building == processBuildings.fractionator) {
      count = count / fractionatorBeltDict[globalParas.defaultFractionBeltType];
    }
    return [building, count];
  }

  powerConsumption(globalParas: GlobalParameter) {
    if (
      this.recipe.building == miningBuildings.miningMachine ||
      this.recipe.building == miningBuildings.oilExtractor
    ) {
      return 0;
    }
    let count = this.recipe.buildingCount(this.item, this.ypm, globalParas);
    if (this.recipe.building == processBuildings.fractionator) {
      count = count / fractionatorBeltDict[globalParas.defaultFractionBeltType];
    }
    return this.recipe.building.powerMW * _.ceil(count);
  }
}
