import styles from './ResultList.less';

import React from 'react';
import Recipe, { getRecipe } from '@/models/Recipe';
import DisplayResult from '@/models/DisplayResult';
import ResultDetail from './ResultDetail';
import { Table, Typography } from 'antd';
import RecipeEntry from './RecipeEntry';
import ResultBuilding from './ResultBuilding';
import ItemImageAvatar from './ItemImageAvatar';
import GlobalParameter from '@/models/GlobalParameter';

const { Title } = Typography;

interface IProps {
  results: DisplayResult[];
  globalParas: GlobalParameter;
  onChangeRecipe(item: string, currentRecipe: Recipe): void;
}

interface IState {}

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
      render: (text: string, data: DisplayResult) => (
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
      render: (text: string, data: DisplayResult) => (
        <div>{data.ypm.toFixed(1)}</div>
      ),
    },
    {
      title: '设施/矿脉',
      dataIndex: 'building',
      key: 'building',
      width: 400,
      render: (text: string, data: DisplayResult) => (
        <ResultBuilding result={data} globalParas={this.props.globalParas} />
      ),
    },
    {
      title: '配方',
      dataIndex: 'recipe',
      key: 'recipe',
      render: (text: string, data: DisplayResult) => (
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
      render: (text: string, data: DisplayResult) =>
        getRecipe(data.item).length > 1 ? (
          <a onClick={() => this.onChangeRecipe(data)}>更改配方</a>
        ) : null,
    },
  ];

  onChangeRecipe(data: DisplayResult) {
    this.props.onChangeRecipe(data.item, data.recipe);
  }

  render() {
    return (
      <div>
        <Title level={3}>计算结果</Title>
        <Table
          pagination={false}
          columns={this.columns}
          expandable={{
            expandedRowRender: (data) => <ResultDetail result={data} />,
            rowExpandable: (data) =>
              Object.keys(data.consumptionDetail).length > 0,
          }}
          rowClassName={(data) => (data.isTarget ? styles.targetRow : '')}
          dataSource={this.props.results}
        />
      </div>
    );
  }
}
