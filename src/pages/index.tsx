import React from 'react';
import styles from './index.less';
import InputPanel from '../components/InputPanel';
import ResultList from '../components/ResultList';
import SumReportPanel from '../components/SumReport';
import { PageHeader, Layout } from 'antd';

const { Header, Content, Footer, Sider } = Layout;

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
      <Layout>
        <PageHeader title="戴森球计划产量计算" subTitle="v0.0.1" />
        <Content>
          <InputPanel calculate={this.calculate} />
          <ResultList
            targetItem={this.state.targetItem}
            expectedYieldPerMin={this.state.expectedYieldPerMin}
          />
          {sumPanel}
        </Content>
        <Footer>footer</Footer>
      </Layout>
    );
  }
}
