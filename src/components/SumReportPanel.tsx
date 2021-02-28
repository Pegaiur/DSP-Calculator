import React from 'react';
import ItemImageAvatar from './ItemImageAvatar';
import { Table, Typography } from 'antd';

const { Title } = Typography;

interface TableData {
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
      key: 'name',
      render: (text: string, data: TableData) => (
        <div>
          <ItemImageAvatar item={data.item} showName={true} />
        </div>
      ),
    },
    {
      title: '产量',
      dataIndex: 'totalYieldPerMin',
      key: 'yieldPerMin',
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
      datas.push({ item: item, totalYieldPerMin: this.props.byproduct[item] });
    }
    return (
      <div>
        <Title level={3}>副产物</Title>
        <Table pagination={false} columns={this.columns} dataSource={datas} />
      </div>
    );
  }
}
