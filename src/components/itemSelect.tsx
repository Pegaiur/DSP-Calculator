import React from 'react';
import { Cascader } from 'antd';
import { allItemNames } from '../items';

interface IProps {
  onChange(value: string): void;
}

interface IState {
  targetItem: string;
}

export default class ItemSelect extends React.Component<IProps, IState> {
  constructor(props: IProps, state: IState) {
    super(props, state);

    this.handleChange = this.handleChange.bind(this);

    this.state = {
      targetItem: '宇宙矩阵',
    };
  }

  handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    this.setState({ targetItem: event.currentTarget.value }, () => {
      this.props.onChange(this.state.targetItem);
    });
  }

  render() {
    let options = Object.keys(allItemNames).map((tier) => {
      return {
        value: tier,
        label: tier,
        children: allItemNames[tier].map((item) => {
          return { value: item, label: item };
        }),
      };
    });
    return (
      <Cascader
        size="large"
        placeholder="请选择目标产物"
        defaultValue={['物品等级9', '宇宙矩阵']}
        options={options}
        onChange={(value, selectedOptions) =>
          this.props.onChange(`${value[1]}`)
        }
      />
    );
  }
}
