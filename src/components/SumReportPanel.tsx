import React from 'react';
import ItemImageAvatar from './ItemImageAvatar';
import RecipeEntry from './RecipeEntry';
import { Table, Typography } from 'antd';
import DisplayResult from '@/models/DisplayResult';
import _ from 'lodash';
import Recipe from '@/models/Recipe';

const { Title } = Typography;

interface IProps {
  byproducts: DisplayResult[];
}

interface IState {}

export default class SumReportPanel extends React.Component<IProps, IState> {
  columns = [
    {
      title: '物品',
      dataIndex: 'item',
      key: 'byproduct name',
      render: (text: string, data: DisplayResult) => (
        <ItemImageAvatar item={data.item} showName={true} />
      ),
    },
    {
      title: '产量',
      dataIndex: 'totalYieldPerMin',
      key: 'byproduct yieldPerMin',
      render: (text: string, data: DisplayResult) => (
        <div>{data.ypm.toFixed(1)}</div>
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
  ];

  render() {
    if (Object.keys(this.props.byproducts).length == 0) {
      return <Title level={3}>没有副产物</Title>;
    }
    return (
      <div>
        <Title level={3}>副产物</Title>
        <Table
          pagination={false}
          columns={this.columns}
          dataSource={this.props.byproducts}
        />
      </div>
    );
  }
}
