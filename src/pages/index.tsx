import React from 'react';
import styles from './index.less';
import InputPanel from '../components/InputPanel';
import ResultList from '../components/ResultList';
import SumReportPanel from '../components/SumReport';
import { ResultModel } from '../main';

import { render } from 'react-dom';

interface IProps {}

interface IState {
  expectedYieldPerMin: number;
  targetItem?: string;
}

export default class IndexPage extends React.Component<IProps, IState> {
  constructor(props: IProps, state: IState) {
    super(props, state);

    this.calculate = this.calculate.bind(this);

    this.state = {
      expectedYieldPerMin: 0,
    };
  }

  calculate(targetItem: string, expectedValue: number) {
    this.setState({
      targetItem: targetItem,
      expectedYieldPerMin: expectedValue,
    });
  }

  render() {
    let sumPanel = <div></div>;
    if (this.state.targetItem != undefined) {
      sumPanel = (
        <SumReportPanel
          item={this.state.targetItem}
          requiredYieldPerMin={this.state.expectedYieldPerMin}
        />
      );
    }
    return (
      <div>
        <h1>戴森球计划产量计算</h1>
        <InputPanel calculate={this.calculate} />
        <ResultList
          targetItem={this.state.targetItem}
          expectedYieldPerMin={this.state.expectedYieldPerMin}
        />
        {sumPanel}
      </div>
    );
  }
}
