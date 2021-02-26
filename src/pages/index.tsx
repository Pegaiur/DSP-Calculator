import React from 'react';
import styles from './index.less';
import InputPanel from '../components/InputPanel';
import ResultList from '../components/ResultList';
import SelectRecipeModal from '../components/SelectRecipeModal';
import SumReportPanel from '../components/SumReport';
import { PageHeader, Layout, Result, Button, Drawer, Affix, Modal } from 'antd';
import { RecipeModel } from '@/recipes';
import { calculate, ResultModel } from '../main';

const { Header, Content, Footer } = Layout;

interface IProps {}

interface IState {
  expectedYieldPerMin: number;
  targetItem?: string;
  specifiedRecipes: { [item: string]: RecipeModel };
  isDrawerVisible: boolean;
  isModalVisible: boolean;
  results?: [{ [item: string]: number }, ResultModel[]];
  changingRecipeItem?: string;
  changingRecipe?: RecipeModel;
}

export default class IndexPage extends React.Component<IProps, IState> {
  constructor(props: IProps, state: IState) {
    super(props, state);

    this.calculate = this.calculate.bind(this);
    this.showDrawer = this.showDrawer.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onChangeRecipe = this.onChangeRecipe.bind(this);
    this.changeRecipe = this.changeRecipe.bind(this);

    this.state = {
      expectedYieldPerMin: 0,
      isDrawerVisible: false,
      specifiedRecipes: {},
      isModalVisible: false,
    };
  }

  calculate(targetItem: string, expectedValue: number) {
    this.setState(
      {
        targetItem: targetItem,
        expectedYieldPerMin: expectedValue,
        isDrawerVisible: false,
      },
      () => {
        let results = calculate(
          this.state.targetItem!,
          this.state.expectedYieldPerMin,
          Object.values(this.state.specifiedRecipes),
        );
        this.setState({ results: results });
      },
    );
  }

  onChangeRecipe(item: string, currentRecipe: RecipeModel) {
    this.setState({
      isModalVisible: true,
      changingRecipe: currentRecipe,
      changingRecipeItem: item,
    });
  }

  changeRecipe(recipe: RecipeModel) {
    let newSpecifiedRecipes = { ...this.state.specifiedRecipes };
    newSpecifiedRecipes[this.state.changingRecipeItem!] = recipe;
    this.setState(
      {
        isModalVisible: false,
        changingRecipeItem: undefined,
        changingRecipe: undefined,
        specifiedRecipes: newSpecifiedRecipes,
      },
      () => {
        this.calculate(this.state.targetItem!, this.state.expectedYieldPerMin);
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

  render() {
    let content = <Content></Content>;
    if (this.state.results == undefined) {
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
            results={this.state.results![1]}
            onChangeRecipe={this.onChangeRecipe}
          />
          <span>
            {this.state.results[0] == {}
              ? '没有多余副产物'
              : '副产物:' +
                Object.keys(this.state.results[0]).map((byproduct) => {
                  return `${byproduct}: ${this.state.results![0][byproduct]}`;
                })}
          </span>
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
          <SelectRecipeModal
            isVisibale={this.state.isModalVisible}
            changingRecipeItem={this.state.changingRecipeItem!}
            changingRecipe={this.state.changingRecipe!}
            onCancel={() => this.setState({ isModalVisible: false })}
            onOk={this.changeRecipe}
          />
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
      </Layout>
    );
  }
}
