import React from 'react';
import Calculation from '@/models/Calculation';
import TargetCard from './TargetCard';
import { Space, Typography } from 'antd';

const { Title } = Typography;

interface IProps {
  calculations: Calculation[];
  onChangeTarget(calculation: Calculation, expectedValue: number): void;
}

interface IState {}

export default class TargetPanel extends React.Component<IProps, IState> {
  constructor(props: IProps, state: IState) {
    super(props, state);
    this.state = {};
  }

  render() {
    return (
      <div>
        <Title level={3}>已规划产能</Title>
        <Space size={[8, 16]} wrap>
          {this.props.calculations.map((calculation, index) => {
            return (
              <TargetCard
                calculation={calculation}
                key={index}
                onChangeTarget={(value) =>
                  this.props.onChangeTarget(calculation, value)
                }
              />
            );
          })}
        </Space>
      </div>
    );
  }
}
