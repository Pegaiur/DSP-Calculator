import { v4 as uuidv4 } from 'uuid';
import Recipe, { getRecipe, recipes } from '@/models/Recipe';
import _ from 'lodash';
import GlobalParameter from '@/models/GlobalParameter';
import Production from './Production';

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

  buildingCount(globalParas: GlobalParameter) {
    return this.recipe.buildingCount(this.item, this.ypm, globalParas);
  }
}
