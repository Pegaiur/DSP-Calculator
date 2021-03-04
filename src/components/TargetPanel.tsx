import React from 'react';
import { Requirement } from '@/models/Core';
import TargetCard from './TargetCard';
import { Space, Typography } from 'antd';

const { Title } = Typography;

interface IProps {
  requirements: Requirement[];
  onChangeTarget(item: string, expectedValue: number): void;
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
          {this.props.requirements.map((requirement, index) => {
            return (
              <TargetCard
                requirement={requirement}
                key={index}
                onChangeTarget={(value) =>
                  this.props.onChangeTarget(requirement.item, value)
                }
              />
            );
          })}
        </Space>
      </div>
    );
  }
}
