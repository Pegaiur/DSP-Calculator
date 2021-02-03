import React from 'react';
import ItemSelect from './itemSelect';

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
      expectedValue: 0,
      warning: true,
      targetItem: '宇宙矩阵',
    };
  }

  handleInput(event: React.FormEvent<HTMLInputElement>) {
    const inputValue = parseInt(event.currentTarget.value);
    if (isNaN(inputValue)) {
      this.setState({ expectedValue: 0, warning: true });
    } else {
      this.setState({ expectedValue: inputValue, warning: false });
    }
  }

  handleClick() {
    this.props.calculate(this.state.targetItem, this.state.expectedValue);
  }

  handleSelect(value: string) {
    this.setState({ targetItem: value });
  }

  render() {
    const warningLabel = this.state.warning ? (
      <h3>请输入期望产量数字（单位：个/分钟）</h3>
    ) : (
      <div></div>
    );

    return (
      <div>
        <h2>目标物品</h2>
        <ItemSelect onChange={this.handleSelect} />
        <h2>期望产量：</h2>
        <input
          type="text"
          value={this.state.expectedValue}
          onInput={this.handleInput}
        />
        {warningLabel}
        <button onClick={this.handleClick}>计算</button>
      </div>
    );
  }
}
