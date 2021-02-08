import React from 'react';
import { RecipeModel } from '../recipes';
import { ResultModel, calculateResults } from '../main';
import { allItemNameArray } from '../items';
import ResultListEntry from './ResultListEntry';

interface IProps {
  targetItem?: string;
  expectedYieldPerMin: number;
}

interface IState {
  results: ResultModel[];
}

export default class ResultList extends React.Component<IProps, IState> {
  constructor(props: IProps, state: IState) {
    super(props, state);

    this.state = { results: [] };
  }

  switchRecipe(item: string, recipe: RecipeModel) {}

  render() {
    if (this.props.targetItem != undefined) {
      let results = calculateResults(
        this.props.targetItem,
        this.props.expectedYieldPerMin,
      );
      let resultArray: ResultModel[][] = [];
      for (let item in results) {
        resultArray.push(results[item]);
      }
      resultArray.sort((aResults, bResults) => {
        return (
          allItemNameArray.indexOf(aResults[0].targetProduct) -
          allItemNameArray.indexOf(bResults[0].targetProduct)
        );
      });
      return resultArray.map((result, index) => {
        return <ResultListEntry result={result} key={index} />;
      });
    }
    return <div>测试</div>;
  }
}
