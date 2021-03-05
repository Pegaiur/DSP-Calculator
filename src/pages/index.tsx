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
import Recipe from '@/models/Recipe';
import Core, { ResultModel } from '@/models/Core';
import GlobalParameter, {
  defaultGlobalParameter,
} from '@/models/GlobalParameter';
import { PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { faqString } from '../faq';
import _ from 'lodash';

const { Content, Footer } = Layout;

interface IProps {}

interface IState {
  requirements: { [item: string]: number };
  specifiedRecipes: { [item: string]: Recipe };
  globalParas: GlobalParameter;
  results: ResultModel[];
  byproducts: { [item: string]: number };
  changingRecipeItem?: string;
  changingRecipe?: Recipe;

  isDrawerVisible: boolean;
  isModalVisible: boolean;
}

export default class IndexPage extends React.Component<IProps, IState> {
  core: Core;

  constructor(props: IProps, state: IState) {
    super(props, state);

    _.bindAll(this, [
      'addCalculation',
      'onChangeRecipe',
      'changeRecipe',
      'onJump',
      'onChangeTarget',
    ]);

    this.core = new Core(defaultGlobalParameter);
    this.state = {
      requirements: {},
      specifiedRecipes: {},
      globalParas: defaultGlobalParameter,
      results: [],
      byproducts: {},
      isDrawerVisible: false,
      isModalVisible: false,
    };
  }

  addCalculation(targetItem: string, expectedValue: number) {
    if (this.state.requirements[targetItem] == undefined) {
      this.state.requirements[targetItem] = expectedValue;
    } else {
      this.state.requirements[targetItem] += expectedValue;
    }
    this.setState({ isDrawerVisible: false });
    this.core.calculate(this.state.requirements, (results, byproducts) => {
      this.setState({
        requirements: this.state.requirements,
        results: results,
        byproducts: byproducts,
      });
      message.success('已添加产能规划');
    });
  }

  onChangeTarget(target: string, expectedValue: number) {
    let requirements = this.state.requirements;
    if (expectedValue == 0) {
      delete requirements[target];
    } else {
      requirements[target] = expectedValue;
    }
    this.core.calculate(requirements, (results, byproducts) => {
      this.setState({
        requirements: requirements,
        results: results,
        byproducts: byproducts,
      });
      message.success(`已${expectedValue == 0 ? '删除' : '修改'}修改产能规划`);
    });
  }

  onChangeRecipe(item: string, currentRecipe: Recipe) {
    this.setState({
      isModalVisible: true,
      changingRecipe: currentRecipe,
      changingRecipeItem: item,
    });
  }

  changeRecipe(recipe: Recipe) {
    let specifiedRecipes: { [item: string]: Recipe } = {};
    _.assign(specifiedRecipes, this.state.specifiedRecipes);
    specifiedRecipes[this.state.changingRecipeItem!] = recipe;
    this.setState(
      {
        isModalVisible: false,
        changingRecipeItem: undefined,
        changingRecipe: undefined,
        specifiedRecipes: specifiedRecipes,
      },
      () => {
        this.core.updateSpecifiedRecipes(
          this.state.specifiedRecipes,
          (results, byproducts) => {
            this.setState({ results: results, byproducts: byproducts });
            message.success('已更改配方');
          },
        );
      },
    );
  }

  onJump(link: string) {
    const w = window.open(link);
  }

  render() {
    let content = <Content></Content>;
    if (this.state.results.length == 0) {
      content = (
        <Content>
          <Result
            title="还没有添加产能目标"
            extra={
              <Button
                type="primary"
                onClick={() => this.setState({ isDrawerVisible: true })}
                key="console"
              >
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
            requirements={this.core.requirementsConvert(
              this.state.requirements,
            )}
            onChangeTarget={this.onChangeTarget}
          />
          <ResultList
            results={this.state.results}
            onChangeRecipe={this.onChangeRecipe}
          />
          <SelectRecipeModal
            isVisibale={this.state.isModalVisible}
            changingRecipeItem={this.state.changingRecipeItem!}
            changingRecipe={this.state.changingRecipe!}
            onCancel={() => this.setState({ isModalVisible: false })}
            onOk={this.changeRecipe}
          />
          <SumReportPanel byproduct={this.state.byproducts} />
          <Affix offsetBottom={100}>
            <Button
              className={styles.mainAffix}
              type="primary"
              shape="round"
              size="large"
              icon={<PlusOutlined />}
              onClick={() => this.setState({ isDrawerVisible: true })}
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
          subTitle="v0.3"
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
          onClose={() => this.setState({ isDrawerVisible: false })}
          visible={this.state.isDrawerVisible}
        >
          <InputPanel calculate={this.addCalculation} />
        </Drawer>
        {content}
        <Footer>
          <span>Powered by </span>
          <a onClick={() => this.onJump('https://space.bilibili.com/16693558')}>
            VirgooTeam喂狗组{' '}
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
