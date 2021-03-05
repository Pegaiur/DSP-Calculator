import { v4 as uuidv4 } from 'uuid';
import Recipe from '@/models/Recipe';
import GlobalParameter from './GlobalParameter';

export default class Production {
  id: string;
  targetProduct: string;
  recipe: Recipe;
  ypm: number;

  constructor(targetProduct: string, recipe: Recipe, ypm: number) {
    this.id = uuidv4();
    this.targetProduct = targetProduct;
    this.recipe = recipe;
    this.ypm = ypm;
  }

  byproducts(globalParameters: GlobalParameter) {
    let products = this.recipe.products;
    if (this.recipe.equivalentRecipe != undefined) {
      products = this.recipe.equivalentRecipe.products;
    }
    if (Object.keys(products).length == 1) {
      return [];
    }
    let byproductions: Production[] = [];
    for (let product in products) {
      if (product != this.targetProduct) {
        let targetProductYPM = this.recipe.recipeYPM(
          this.targetProduct,
          globalParameters,
        );
        let byproductYPM = this.recipe.recipeYPM(product, globalParameters);
        byproductions.push(
          new Production(
            product,
            this.recipe,
            (this.ypm * byproductYPM) / targetProductYPM,
          ),
        );
      }
    }
    return byproductions;
  }
}
