import Calculation, { ResultModel } from './Calculation';
import { RecipeModel } from '@/recipes';
import _ from 'lodash';
import { allItemNameArray } from '@/items';

export interface GlobalParameter {
  veinsUtilizationLevel: number;
  defaultBenchType: string;
  defaultFractionBeltType: string;
  defaultGasGaintYield: { [item: string]: number };
  defaultIceGaintYield: { [item: string]: number };
}

export default class Plan {
  globalParameters: GlobalParameter;
  calculations: Calculation[];
  specifiedRecipes: { [item: string]: RecipeModel };
  displayResults: ResultModel[];
  byproducts: { [item: string]: number };

  constructor(globalParameters: GlobalParameter) {
    this.globalParameters = globalParameters;
    this.calculations = [];
    this.specifiedRecipes = {};
    this.displayResults = [];
    this.byproducts = {};
  }

  private sortResults() {
    this.displayResults.sort((aResult, bResult) => {
      return (
        allItemNameArray.indexOf(aResult.item) -
        allItemNameArray.indexOf(bResult.item)
      );
    });
  }

  newCalculation(targetItem: string, expectedYieldPerMin: number) {
    let calculation = new Calculation(
      targetItem,
      expectedYieldPerMin,
      this.specifiedRecipes,
    );
    this.calculations.push(calculation);
    calculation.results.forEach((result) => {
      let resultToMerge = _.find(
        this.displayResults,
        (r) => r.item == result.item,
      );
      if (resultToMerge == undefined) {
        this.displayResults.push(result);
      } else {
        resultToMerge.totalYieldPerMin += result.totalYieldPerMin;
        _.assignWith(
          resultToMerge.consumptionDetail,
          result.consumptionDetail,
          (objValue, srcValue) => {
            return objValue == undefined ? srcValue : objValue + srcValue;
          },
        );
        resultToMerge.isTarget =
          resultToMerge.isTarget == true
            ? resultToMerge.isTarget
            : result.isTarget;
      }
    });
    _.assignWith(
      this.byproducts,
      calculation.byproducts,
      (objValue, srcValue) => {
        return objValue == undefined ? srcValue : objValue + srcValue;
      },
    );
    this.sortResults();
  }

  editCalculation(calculationToEdit: Calculation, expectedValue: number) {
    if (expectedValue == 0) {
      _.remove(this.calculations, (calculation) => {
        return calculation.id == calculationToEdit.id;
      });
    }
    calculationToEdit.results.forEach((resultToDelete) => {
      let resultToMerge = _.find(
        this.displayResults,
        (r) => r.item == resultToDelete.item,
      )!;
      resultToMerge.totalYieldPerMin -= resultToDelete.totalYieldPerMin;
      if (resultToMerge.totalYieldPerMin == 0) {
        _.remove(this.displayResults, (r) => {
          return r == resultToMerge;
        });
      } else {
        _.mapValues(resultToDelete.consumptionDetail, (value, item) => {
          resultToMerge.consumptionDetail[item] -= value;
          if (resultToMerge.consumptionDetail[item] == 0) {
            resultToMerge.consumptionDetail[item] == undefined;
          }
        });
      }
    });
    _.mapValues(calculationToEdit.byproducts, (value, item) => {
      this.byproducts[item] -= value;
      if (this.byproducts[item] == 0) {
        this.byproducts[item] == undefined;
      }
    });
    console.log(calculationToEdit, this.displayResults);
    if (expectedValue > 0) {
      calculationToEdit.recalculate(expectedValue);
      calculationToEdit.results.forEach((result) => {
        let resultToMerge = _.find(
          this.displayResults,
          (r) => r.item == result.item,
        );
        if (resultToMerge == undefined) {
          this.displayResults.push(result);
        } else {
          resultToMerge.totalYieldPerMin += result.totalYieldPerMin;
          _.assignWith(
            resultToMerge.consumptionDetail,
            result.consumptionDetail,
            (objValue, srcValue) => {
              return objValue == undefined ? srcValue : objValue + srcValue;
            },
          );
          resultToMerge.isTarget =
            resultToMerge.isTarget == true
              ? resultToMerge.isTarget
              : result.isTarget;
        }
      });
      _.assignWith(
        this.byproducts,
        calculationToEdit.byproducts,
        (objValue, srcValue) => {
          return objValue == undefined ? srcValue : objValue + srcValue;
        },
      );
      this.sortResults();
    }
  }

  updateSpecifiedRecipes(item: string, recipe: RecipeModel) {
    this.displayResults = [];
    this.byproducts = {};
    this.specifiedRecipes[item] = recipe;
    this.calculations.forEach((calculation) => {
      calculation.specifiedRecipes = this.specifiedRecipes;
      calculation.recalculate(calculation.expectedYieldPerMin);
      calculation.results.forEach((result) => {
        let resultToMerge = _.find(
          this.displayResults,
          (r) => r.item == result.item,
        );
        if (resultToMerge == undefined) {
          this.displayResults.push(result);
        } else {
          resultToMerge.totalYieldPerMin += result.totalYieldPerMin;
          _.assignWith(
            resultToMerge.consumptionDetail,
            result.consumptionDetail,
            (objValue, srcValue) => {
              return objValue == undefined ? srcValue : objValue + srcValue;
            },
          );
          resultToMerge.isTarget =
            resultToMerge.isTarget == true
              ? resultToMerge.isTarget
              : result.isTarget;
        }
      });
      _.assignWith(
        this.byproducts,
        calculation.byproducts,
        (objValue, srcValue) => {
          return objValue == undefined ? srcValue : objValue + srcValue;
        },
      );
    });
    this.sortResults();
  }
}
