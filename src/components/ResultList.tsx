import styles from './ResultList.less';

import React from 'react';
import Recipe, { getRecipe } from '@/models/Recipe';
import Building from '@/models/Building';
import DisplayResult from '@/models/DisplayResult';
import ResultDetail from './ResultDetail';
import { Table, Typography, Select } from 'antd';
import RecipeEntry from './RecipeEntry';
import ResultBuilding from './ResultBuilding';
import ItemImageAvatar from './ItemImageAvatar';
import GlobalParameter from '@/models/GlobalParameter';

const { Title } = Typography;
const { Option } = Select;

interface IProps {
  results: DisplayResult[];
  globalParas: GlobalParameter;
  onChangeRecipe(item: string, currentRecipe: Recipe): void;
  onChangeBench(recipe: Recipe, bench: string): void;
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
      width: 250,
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
          renderEquivalentRecipe={true}
          onSelect={() => {}}
        />
      ),
    },
    {
      title: '耗能',
      dataIndex: '',
      key: 'power consumption',
      render: (text: string, data: DisplayResult) => {
        let powerConsumption = data.powerConsumption(this.props.globalParas);
        if (powerConsumption == 0) {
          return <div></div>;
        }
        return <div>{powerConsumption.toFixed(0)} MW</div>;
      },
    },
    // { title: '传送带', dataIndex: '', key: '' },
    {
      title: '操作',
      key: 'action',
      render: (text: string, data: DisplayResult) => {
        return (
          <div>
            <div>
              {getRecipe(data.item).length > 1 ? (
                <a onClick={() => this.onChangeRecipe(data)}>更改配方</a>
              ) : null}
            </div>
            <br />
            {data.recipe.processByBench ? (
              <div>
                <Select
                  defaultValue={data.recipe.building.name}
                  style={{ width: 120 }}
                  onChange={(value) => {
                    this.props.onChangeBench(data.recipe, value);
                  }}
                >
                  <Option value="制造台MKI">制造台MKI</Option>
                  <Option value="制造台MKII">制造台MKII</Option>
                  <Option value="制造台MKIII">制造台MKIII</Option>
                </Select>
              </div>
            ) : null}
          </div>
        );
      },
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
