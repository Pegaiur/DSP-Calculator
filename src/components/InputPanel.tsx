import React from 'react';
import ItemSelect from './ItemSelect';
import { InputNumber, Button, Popconfirm } from 'antd';
import { BarChartOutlined } from '@ant-design/icons';

interface IProps {
  calculate(targetItem: string, expectedValue: number): void;
}

interface IState {
  expectedValue: number;
  targetItem: string;
  warning: boolean;
}

export default class InputPanel extends React.Component<IProps, IState> {
  constructor(props: IProps, state: IState) {
    super(props, state);

    this.handleInput = this.handleInput.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleSelect = this.handleSelect.bind(this);

    this.state = {
      expectedValue: 10,
      warning: true,
      targetItem: '三级恢复联剂',
    };
  }

  handleInput(value: string) {
    const inputValue = parseInt(`${value}`);
    if (isNaN(inputValue)) {
      this.setState({ expectedValue: 0, warning: true });
    } else {
      this.setState({ expectedValue: inputValue, warning: false });
    }
  }

  handleClick() {
    if (this.state.expectedValue != 0) {
      this.props.calculate(this.state.targetItem, this.state.expectedValue);
    }
  }

  handleSelect(value: string) {
    this.setState({ targetItem: value });
  }

  render() {
    const warningLabel = this.state.warning ? (
      <span>(单位：个/分钟）</span>
    ) : (
      <div></div>
    );

    return (
      <div>
        <h2>目标物品</h2>
        <ItemSelect onChange={this.handleSelect} />
        <h2>期望产量：</h2>
        <InputNumber
          size="large"
          min={1}
          max={65535}
          value={this.state.expectedValue}
          onChange={(value) => this.handleInput(`${value}`)}
        />
        {warningLabel}
        <br />
        <br />
        <Button
          type="primary"
          shape="round"
          size="large"
          icon={<BarChartOutlined />}
          onClick={this.handleClick}
        >
          计算
        </Button>
      </div>
    );
  }
}
