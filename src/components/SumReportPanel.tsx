import React from 'react';
import ItemImageAvatar from './ItemImageAvatar';
import { Table, Typography } from 'antd';
import _ from 'lodash';

const { Title } = Typography;

interface TableData {
  key: string;
  item: string;
  totalYieldPerMin: number;
}

interface IProps {
  byproduct: { [item: string]: number };
}

interface IState {}

export default class SumReportPanel extends React.Component<IProps, IState> {
  columns = [
    {
      title: '物品',
      dataIndex: 'item',
      key: 'byproduct name',
      render: (text: string, data: TableData) => (
        <ItemImageAvatar item={data.item} showName={true} />
      ),
    },
    {
      title: '产量',
      dataIndex: 'totalYieldPerMin',
      key: 'byproduct yieldPerMin',
      render: (text: string, data: TableData) => (
        <div>{data.totalYieldPerMin.toFixed(1)}</div>
      ),
    },
  ];

  render() {
    if (Object.keys(this.props.byproduct).length == 0) {
      return <Title level={3}>没有副产物</Title>;
    }
    let datas: TableData[] = [];
    for (let item in this.props.byproduct) {
      datas.push({
        item: item,
        totalYieldPerMin: this.props.byproduct[item],
        key: item,
      });
    }
    return (
      <div>
        <Title level={3}>副产物</Title>
        <Table pagination={false} columns={this.columns} dataSource={datas} />
      </div>
    );
  }
}
