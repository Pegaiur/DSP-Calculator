import {
  ResultModel,
  FlatResultModel,
  flattenResults,
  getTargetItem,
} from '../main';
import React from 'react';
import { RecipeModel } from '../recipes';

interface IProps {
  result: ResultModel[];
}

interface IState {
  isUnfolded: boolean;
}

export default class ResultListEntry extends React.Component<IProps, IState> {
  constructor(props: IProps, state: IState) {
    super(props, state);

    this.switchDetail = this.switchDetail.bind(this);

    this.state = { isUnfolded: false };
  }

  switchDetail() {
    this.setState({ isUnfolded: !this.state.isUnfolded });
  }

  render() {
    let totalYieldPerMin = 0;
    this.props.result.forEach((result) => {
      if (result.targetMaterial == undefined) {
        totalYieldPerMin += result.yieldPerMin;
      }
    });

    let button = (
      <button onClick={this.switchDetail}>
        {this.state.isUnfolded ? '折叠详情' : '详情'}
      </button>
    );

    let detailResults: FlatResultModel[][] = [];
    // if (this.state.isUnfolded) {
    detailResults = flattenResults(this.props.result);
    // }
    let consumptionDetailResults = detailResults[0];
    let productionDetailResults = detailResults[1];
    return (
      <div>
        <div>
          物品：{getTargetItem(this.props.result)!.targetProduct} 产量：
          {totalYieldPerMin.toFixed(1)}/分钟{' '}
          {this.props.result[0].recipe.materials != {} ? button : null}
          {/* TODO: hide detail for minerals */}
        </div>
        {consumptionDetailResults.map((flatResult, index) => {
          return (
            <div key={index}>
              {flatResult.targetMaterial} 制造 {flatResult.targetProduct} 消耗：
              {flatResult.yieldPerMin.toFixed(1)}/分钟
            </div>
          );
        })}
        <div>——————————————————————————</div>
        {productionDetailResults.map((flatResult, index) => {
          return (
            <div key={index}>
              {flatResult.targetMaterial} 制造 {flatResult.targetProduct} 消耗：
              {flatResult.yieldPerMin.toFixed(1)}/分钟
            </div>
          );
        })}
      </div>
    );
  }
}
