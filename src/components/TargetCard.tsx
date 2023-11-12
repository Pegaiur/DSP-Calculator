import React from 'react';
import { Requirement } from '@/models/Core';
import { Card, Popconfirm, InputNumber } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import ItemImageAvatar from './ItemImageAvatar';

const { Meta } = Card;

interface IProps {
  requirement: Requirement;
  onChangeTarget(expectedValue: number): void;
}

interface IState {
  expectedValue: number;
}

export default class TargetCard extends React.Component<IProps, IState> {
  constructor(props: IProps, state: IState) {
    super(props, state);

    this.handleInput = this.handleInput.bind(this);

    this.state = {
      expectedValue: 10,
    };
  }

  handleInput(value: string) {
    const inputValue = parseInt(value);
    if (isNaN(inputValue)) {
      this.setState({ expectedValue: 10 });
    } else {
      this.setState({ expectedValue: inputValue });
    }
  }

  render() {
    return (
      <Card
        style={{ width: 260 }}
        actions={[
          <Popconfirm
            placement="topLeft"
            title={
              <div>
                修改目标产能：
                <InputNumber
                  min={1}
                  max={65535}
                  defaultValue={this.props.requirement.expectedYieldPerMin}
                  value={this.state.expectedValue}
                  onChange={(value) => this.handleInput(`${value}`)}
                />
              </div>
            }
            onConfirm={() =>
              this.props.onChangeTarget(this.state.expectedValue)
            }
            key="edit pop"
          >
            <EditOutlined key="edit" />
          </Popconfirm>,
          <Popconfirm
            placement="topRight"
            title={'要删除此产能规划吗？'}
            onConfirm={() => this.props.onChangeTarget(0)}
            key="delete pop"
          >
            <DeleteOutlined key="delete" />
          </Popconfirm>,
        ]}
      >
        <Meta
          avatar={<ItemImageAvatar item={this.props.requirement.item} />}
          title={this.props.requirement.item}
          description={`目标产量：${this.props.requirement.expectedYieldPerMin}/分钟`}
        />
      </Card>
    );
  }
}
