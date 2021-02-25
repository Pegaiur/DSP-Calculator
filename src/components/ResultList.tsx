import styles from './ItemImageAvatar.less';

import React from 'react';
import { RecipeModel } from '../recipes';
import { ResultModel, calculate } from '../main';
import ResultDetail from './ResultDetail';
import { Table, Avatar } from 'antd';
import ResultRecipeEntry from './ResultRecipeEntry';
import ResultBuilding from './ResultBuilding';
import itemImagesJSON from '../icon-index.json';

const itemImages: { [item: string]: string } = itemImagesJSON.data;

const columns = [
  {
    title: '物品',
    dataIndex: 'item',
    key: 'name',
    render: (text: string, data: TableData) => (
      <div>
        <Avatar
          shape="square"
          size={40}
          src={
            <img
              id={styles.itemImage}
              src={
                itemImages[data.item] +
                '?x-oss-process=image/resize,l_40,m_lfit'
              }
            />
          }
        />
        {data.item}
      </div>
    ),
  },
  {
    title: '产量(个/每分钟)',
    dataIndex: 'totalYieldPerMin',
    key: 'yieldPerMin',
    render: (text: string, data: TableData) => (
      <div>{data.totalYieldPerMin.toFixed(1)}</div>
    ),
  },
  {
    title: '设施数量',
    dataIndex: 'building',
    key: 'building',
    render: (text: string, data: TableData) => <ResultBuilding data={data} />,
  },
  {
    title: '配方',
    dataIndex: 'recipe',
    key: 'recipe',
    children: [
      {
        title: '原材料',
        dataIndex: '',
        key: '',
        render: (text: string, data: TableData) => (
          <ResultRecipeEntry items={data.recipe.materials} />
        ),
      },
      {
        title: '耗时',
        dataIndex: '',
        key: '',
        render: (text: string, data: TableData) => (
          <div>{data.recipe.time}秒</div>
        ),
      },
      {
        title: '产物',
        dataIndex: '',
        key: '',
        render: (text: string, data: TableData) => (
          <ResultRecipeEntry items={data.recipe.products} />
        ),
      },
    ],
  },
  // { title: '传送带', dataIndex: '', key: '' },
];

interface IProps {
  targetItem?: string;
  expectedYieldPerMin: number;
}

interface IState {
  results: ResultModel[];
}

export interface TableData {
  key: number;
  item: string;
  totalYieldPerMin: number;
  recipe: RecipeModel;
  consumptionDetail: { [item: string]: number };
}

export default class ResultList extends React.Component<IProps, IState> {
  constructor(props: IProps, state: IState) {
    super(props, state);

    this.state = { results: [] };
  }

  switchRecipe(item: string, recipe: RecipeModel) {}

  render() {
    if (this.props.targetItem != undefined) {
      let results = calculate(
        this.props.targetItem,
        this.props.expectedYieldPerMin,
      );
      let datas = results[1].map((result, index) => {
        let data: TableData = {
          key: index,
          item: result.item,
          totalYieldPerMin: result.totalYieldPerMin,
          recipe: result.currentRecipe,
          consumptionDetail: result.consumptionDetail,
        };
        return data;
      });

      return (
        <div>
          <Table
            bordered={true}
            pagination={false}
            columns={columns}
            expandable={{
              expandedRowRender: (data) => <ResultDetail data={data} />,
              rowExpandable: (data) =>
                Object.keys(data.consumptionDetail).length > 0,
            }}
            dataSource={datas}
          />
          <span>{results[0] == {} ? '没有多余副产物' : 'test'}</span>
        </div>
      );
    }
    return <div>测试</div>;
  }
}
