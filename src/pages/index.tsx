import styles from './index.less';
import dspLogo from '../assets/Dsp-Logo.png';

import React from 'react';
import InputPanel from '../components/InputPanel';
import ResultList from '../components/ResultList';
import SelectRecipeModal from '../components/SelectRecipeModal';
import SumReportPanel from '../components/SumReportPanel';
import TargetPanel from '@/components/TargetPanel';
import {
  PageHeader,
  Layout,
  Result,
  Button,
  Drawer,
  Affix,
  Modal,
  message,
} from 'antd';
import { RecipeModel } from '@/recipes';
import Plan from '@/models/Plan';
import Calculation from '@/models/Calculation';
import { GlobalParameter } from '@/models/Plan';
import { PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { faqString } from '../faq';
import _ from 'lodash';

const { Header, Content, Footer } = Layout;

interface IProps {}

interface IState {
  plan: Plan;
  calculations: Calculation[];
  changingRecipeItem?: string;
  changingRecipe?: RecipeModel;

  isDrawerVisible: boolean;
  isModalVisible: boolean;
}

export default class IndexPage extends React.Component<IProps, IState> {
  constructor(props: IProps, state: IState) {
    super(props, state);

    _.bindAll(this, [
      'addCalculation',
      'showDrawer',
      'onClose',
      'onChangeRecipe',
      'changeRecipe',
      'onJump',
      'onChangeTarget',
    ]);

    const defaultGlobalParas: GlobalParameter = {
      veinsUtilizationLevel: 0,
      defaultBenchType: '制造台MKI',
      defaultFractionBeltType: '传送带',
      defaultGasGaintYield: { 氢: 0.75, 重氢: 0.05 },
      defaultIceGaintYield: { 氢: 0.35, 可燃冰: 0.7 },
    };
    let plan = new Plan(defaultGlobalParas);
    this.state = {
      isDrawerVisible: false,
      isModalVisible: false,
      plan: plan,
      calculations: plan.calculations,
    };
  }

  addCalculation(targetItem: string, expectedValue: number) {
    this.state.plan.newCalculation(targetItem, expectedValue);
    this.setState({ isDrawerVisible: false });
    message.success('已添加产能规划');
  }

  onChangeTarget(calculation: Calculation, expectedValue: number) {
    this.state.plan.editCalculation(calculation, expectedValue);
    this.setState({ calculations: this.state.plan.calculations });
    if (expectedValue == 0) {
      message.success('已删除产能规划');
      console.log(this.state.calculations);
    } else {
      message.success('已修改产能规划');
    }
  }

  onChangeRecipe(item: string, currentRecipe: RecipeModel) {
    this.setState({
      isModalVisible: true,
      changingRecipe: currentRecipe,
      changingRecipeItem: item,
    });
  }

  changeRecipe(recipe: RecipeModel) {
    this.state.plan.updateSpecifiedRecipes(
      this.state.changingRecipeItem!,
      recipe,
    );
    this.setState(
      {
        isModalVisible: false,
        changingRecipeItem: undefined,
        changingRecipe: undefined,
        calculations: this.state.plan.calculations,
      },
      () => {
        message.success('已更改配方');
      },
    );
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

  onJump(link: string) {
    const w = window.open(link);
  }

  render() {
    let content = <Content></Content>;
    if (this.state.plan.calculations.length == 0) {
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
          <TargetPanel
            calculations={this.state.calculations}
            onChangeTarget={this.onChangeTarget}
          />
          <ResultList
            plan={this.state.plan}
            displayResults={this.state.plan.displayResults}
            onChangeRecipe={this.onChangeRecipe}
          />
          <SelectRecipeModal
            isVisibale={this.state.isModalVisible}
            changingRecipeItem={this.state.changingRecipeItem!}
            changingRecipe={this.state.changingRecipe!}
            onCancel={() => this.setState({ isModalVisible: false })}
            onOk={this.changeRecipe}
          />
          <SumReportPanel byproduct={this.state.plan.byproducts} />
          <Affix offsetBottom={100}>
            <Button
              className={styles.mainAffix}
              type="primary"
              shape="round"
              size="large"
              icon={<PlusOutlined />}
              onClick={this.showDrawer}
            >
              添加产能
            </Button>
          </Affix>
        </Content>
      );
    }
    return (
      <Layout>
        <PageHeader
          title="戴森球计划量化计算器"
          subTitle="v0.1"
          avatar={{ src: dspLogo }}
          extra={[
            <Button
              type="primary"
              shape="round"
              size="large"
              key="faq"
              icon={<QuestionCircleOutlined />}
              onClick={() =>
                Modal.info({
                  title: 'FAQ',
                  content: <div style={{ whiteSpace: 'pre' }}>{faqString}</div>,
                  onOk() {},
                })
              }
            >
              FAQ
            </Button>,
          ]}
        />
        <Drawer
          title="添加产能"
          placement="left"
          closable={false}
          onClose={this.onClose}
          visible={this.state.isDrawerVisible}
        >
          <InputPanel calculate={this.addCalculation} />
        </Drawer>
        {content}
        <Footer>
          <span>Powered by </span>
          <a onClick={() => this.onJump('https://space.bilibili.com/16693558')}>
            VirgooTeam 喂狗组{' '}
          </a>
          -
          <a onClick={() => this.onJump('https://space.bilibili.com/58978')}>
            {' '}
            佩奇Pegaiur
          </a>
          &
          <a
            onClick={() => this.onJump('https://space.bilibili.com/486788855')}
          >
            TNA速通会
          </a>
          ©️ 2021
        </Footer>
      </Layout>
    );
  }
}
