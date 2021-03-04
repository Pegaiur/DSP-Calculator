import styles from './ResultList.less';

import React from 'react';
import { getRecipe, RecipeModel } from '../recipes';
import { ResultModel } from '@/models/Core';
import ResultDetail from './ResultDetail';
import { Table, Typography } from 'antd';
import RecipeEntry from './RecipeEntry';
import ResultBuilding from './ResultBuilding';
import ItemImageAvatar from './ItemImageAvatar';

const { Title } = Typography;

interface IProps {
  results: ResultModel[];
  onChangeRecipe(item: string, currentRecipe: RecipeModel): void;
}

interface IState {}

export interface TableData {
  key: number;
  item: string;
  totalYieldPerMin: number;
  recipe: RecipeModel;
  consumptionDetail: { [item: string]: number };
  isTarget: boolean;
}

export default class ResultList extends React.Component<IProps, IState> {
  constructor(props: IProps, state: IState) {
    super(props, state);

    this.onChangeRecipe = this.onChangeRecipe.bind(this);

    this.state = {};
  }

  columns = [
    {
      title: '物品',
      dataIndex: 'item',
      key: 'name',
      render: (text: string, data: TableData) => (
        <div>
          <ItemImageAvatar item={data.item} showName={true} />
        </div>
      ),
    },
    {
      title: '产量(个/每分钟)',
      dataIndex: 'totalYieldPerMin',
      key: 'yieldPerMin',
      width: 140,
      render: (text: string, data: TableData) => (
        <div>{data.totalYieldPerMin.toFixed(1)}</div>
      ),
    },
    {
      title: '设施/矿脉',
      dataIndex: 'building',
      key: 'building',
      width: 400,
      render: (text: string, data: TableData) => <ResultBuilding data={data} />,
    },
    {
      title: '配方',
      dataIndex: 'recipe',
      key: 'recipe',
      render: (text: string, data: TableData) => (
        <RecipeEntry
          recipe={data.recipe}
          selected={false}
          onSelect={() => {}}
        />
      ),
    },
    // { title: '传送带', dataIndex: '', key: '' },
    {
      title: '操作',
      key: 'action',
      render: (text: string, data: TableData) =>
        getRecipe(data.item).length > 1 ? (
          <a onClick={() => this.onChangeRecipe(data)}>更改配方</a>
        ) : null,
    },
  ];

  onChangeRecipe(data: TableData) {
    this.props.onChangeRecipe(data.item, data.recipe);
  }

  render() {
    let datas = this.props.results.map((result, index) => {
      let data: TableData = {
        key: index,
        item: result.item,
        totalYieldPerMin: result.totalYieldPerMin,
        recipe: result.currentRecipe,
        consumptionDetail: result.consumptionDetail,
        isTarget: result.isTarget == true ? true : false,
      };
      return data;
    });

    return (
      <div>
        <Title level={3}>计算结果</Title>
        <Table
          pagination={false}
          columns={this.columns}
          expandable={{
            expandedRowRender: (data) => <ResultDetail data={data} />,
            rowExpandable: (data) =>
              Object.keys(data.consumptionDetail).length > 0,
          }}
          rowClassName={(data) => (data.isTarget ? styles.targetRow : '')}
          dataSource={datas}
        />
      </div>
    );
  }
}
