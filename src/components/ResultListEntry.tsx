import { ResultModel, FlatResultModel, flattenResults } from '../main';
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
      totalYieldPerMin += result.yieldPerMin;
    });

    let button = (
      <button onClick={this.switchDetail}>
        {this.state.isUnfolded ? '折叠详情' : '详情'}
      </button>
    );

    let productionDetailResults: FlatResultModel[] = [];
    if (this.state.isUnfolded) {
      productionDetailResults = flattenResults(this.props.result);
    }
    return (
      <div>
        <div>
          物品：{this.props.result[0].targetProduct} 产量：
          {totalYieldPerMin.toFixed(1)}/分钟 {button}
        </div>
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
