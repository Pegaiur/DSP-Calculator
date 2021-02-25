import React from 'react';
import styles from './index.less';
import InputPanel from '../components/InputPanel';
import ResultList from '../components/ResultList';
import SumReportPanel from '../components/SumReport';
import { PageHeader, Layout, Result, Button, Drawer, Affix } from 'antd';

const { Header, Content, Footer } = Layout;

interface IProps {}

interface IState {
  expectedYieldPerMin: number;
  targetItem?: string;
  isDrawerVisible: boolean;
}

export default class IndexPage extends React.Component<IProps, IState> {
  constructor(props: IProps, state: IState) {
    super(props, state);

    this.calculate = this.calculate.bind(this);
    this.showDrawer = this.showDrawer.bind(this);
    this.onClose = this.onClose.bind(this);

    this.state = {
      expectedYieldPerMin: 0,
      isDrawerVisible: false,
    };
  }

  calculate(targetItem: string, expectedValue: number) {
    this.setState({
      targetItem: targetItem,
      expectedYieldPerMin: expectedValue,
      isDrawerVisible: false,
    });
  }

  showDrawer = () => {
    this.setState({
      isDrawerVisible: true,
    });
  };

  onClose = () => {
    this.setState({
      isDrawerVisible: false,
    });
  };

  render() {
    // let sumPanel = <div></div>;
    // if (this.state.targetItem != undefined) {
    //   sumPanel = (
    //     <SumReportPanel
    //       item={this.state.targetItem}
    //       requiredYieldPerMin={this.state.expectedYieldPerMin}
    //     />
    //   );
    // }
    let content = <Content></Content>;
    if (this.state.targetItem == undefined) {
      content = (
        <Content>
          <Result
            title="还没有添加产能目标"
            extra={
              <Button type="primary" onClick={this.showDrawer} key="console">
                添加产能
              </Button>
            }
          />
        </Content>
      );
    } else {
      content = (
        <Content>
          <ResultList
            targetItem={this.state.targetItem}
            expectedYieldPerMin={this.state.expectedYieldPerMin}
          />
          <Affix offsetBottom={100}>
            <Button
              className={styles.mainAffix}
              type="primary"
              shape="round"
              size="large"
              onClick={this.showDrawer}
            >
              添加产能
            </Button>
          </Affix>
          {/* {sumPanel} */}
        </Content>
      );
    }
    return (
      <Layout>
        <PageHeader title="戴森球计划产能计算器" subTitle="v0.0.1" />
        <Drawer
          title="添加产能"
          placement="right"
          closable={false}
          onClose={this.onClose}
          visible={this.state.isDrawerVisible}
        >
          <InputPanel calculate={this.calculate} />
        </Drawer>
        {content}
        {/* <Footer>footer</Footer> */}
      </Layout>
    );
  }
}
