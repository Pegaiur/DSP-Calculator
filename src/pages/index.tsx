import styles from './index.less';
import dspLogo from '../assets/Dsp-Logo.png';

import React from 'react';
import InputPanel from '../components/InputPanel';
import ResultList from '../components/ResultList';
import SelectRecipeModal from '../components/SelectRecipeModal';
import SumReportPanel from '../components/SumReportPanel';
import TargetPanel from '@/components/TargetPanel';
import GlobalParasPanel from '@/components/GlobalParasPanel';
import {
  PageHeader,
  Layout,
  Result,
  Button,
  Drawer,
  Affix,
  Modal,
  message,
  BackTop,
} from 'antd';
import Recipe, { setGlobalParas } from '@/models/Recipe';
import Core from '@/models/Core';
import DisplayResult from '@/models/DisplayResult';
import GlobalParameter, {
  defaultGlobalParameter,
} from '@/models/GlobalParameter';
import {
  PlusOutlined,
  QuestionCircleOutlined,
  ProfileOutlined,
} from '@ant-design/icons';
import { faqString } from '../faq';
import _ from 'lodash';
import Building, { benchDict } from '@/models/Building';

const { Content, Footer } = Layout;

interface IProps {}

interface IState {
  requirements: { [item: string]: number };
  specifiedRecipes: { [item: string]: Recipe };
  globalParas: GlobalParameter;
  results: DisplayResult[];
  byproducts: DisplayResult[];
  changingRecipeItem?: string;
  changingRecipe?: Recipe;

  isModifyingParas: boolean;
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
      'onChangeBench',
      'onJump',
      'onChangeTarget',
    ]);

    this.core = new Core(defaultGlobalParameter);
    this.state = {
      requirements: {},
      specifiedRecipes: {},
      globalParas: defaultGlobalParameter,
      results: [],
      byproducts: [],
      isModifyingParas: false,
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

  onChangeBench(recipe: Recipe, bench: string) {
    recipe.building = benchDict[bench];
    this.core.calculate(this.state.requirements, (results, byproducts) => {
      this.setState({ results: results, byproducts: byproducts });
      message.success('已更改制造台等级');
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
                shape="round"
                size="large"
                icon={<PlusOutlined />}
                onClick={() =>
                  this.setState({
                    isModifyingParas: false,
                    isDrawerVisible: true,
                  })
                }
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
            globalParas={this.state.globalParas}
            onChangeRecipe={this.onChangeRecipe}
            onChangeBench={this.onChangeBench}
          />
          <SelectRecipeModal
            isVisibale={this.state.isModalVisible}
            changingRecipeItem={this.state.changingRecipeItem!}
            changingRecipe={this.state.changingRecipe!}
            onCancel={() => this.setState({ isModalVisible: false })}
            onOk={this.changeRecipe}
          />
          <SumReportPanel byproducts={this.state.byproducts} />
          <Affix offsetBottom={100}>
            <Button
              className={styles.mainAffix}
              type="primary"
              shape="round"
              size="large"
              icon={<PlusOutlined />}
              onClick={() =>
                this.setState({
                  isModifyingParas: false,
                  isDrawerVisible: true,
                })
              }
            >
              添加产能
            </Button>
          </Affix>
        </Content>
      );
    }

    let panel = <InputPanel calculate={this.addCalculation} />;
    if (this.state.isModifyingParas) {
      panel = (
        <GlobalParasPanel
          globalParas={this.state.globalParas}
          onChangeGlobalParas={(paras) => {
            this.setState({
              globalParas: paras,
              isDrawerVisible: false,
            });
            setGlobalParas(this.state.globalParas);
            this.core.calculate(
              this.state.requirements,
              (results, byproducts) => {
                this.setState({ results: results, byproducts: byproducts });
                message.success('已修改生产参数');
              },
            );
          }}
        />
      );
    }
    return (
      <Layout>
        <PageHeader title="明日方舟：终末地量化计算器" subTitle="v0.15" />
        <Drawer
          title={this.state.isModifyingParas ? '修改生产参数' : '添加产能'}
          placement="left"
          closable={false}
          onClose={() => this.setState({ isDrawerVisible: false })}
          visible={this.state.isDrawerVisible}
        >
          {panel}
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
          ©️ 2023
        </Footer>
      </Layout>
    );
  }
}
