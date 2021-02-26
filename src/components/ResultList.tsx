import React from 'react';
import { getRecipe, RecipeModel } from '../recipes';
import { ResultModel } from '../main';
import ResultDetail from './ResultDetail';
import { Table } from 'antd';
import RecipeEntry from './RecipeEntry';
import ResultBuilding from './ResultBuilding';
import ItemImageAvatar from './ItemImageAvatar';

interface IProps {
  targetItem?: string;
  onChangeRecipe(item: string, currentRecipe: RecipeModel): void;
  results: ResultModel[];
}

interface IState {}

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

    this.onChangeRecipe = this.onChangeRecipe.bind(this);

    this.state = {
      results: [],
    };
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
      title: '设施数量',
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
    if (this.props.targetItem != undefined) {
      let datas = this.props.results.map((result, index) => {
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
            // bordered={true}
            pagination={false}
            columns={this.columns}
            expandable={{
              expandedRowRender: (data) => <ResultDetail data={data} />,
              rowExpandable: (data) =>
                Object.keys(data.consumptionDetail).length > 0,
            }}
            dataSource={datas}
          />
        </div>
      );
    }
    return <div>测试</div>;
  }
}
