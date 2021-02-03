import React from 'react';
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
      console.log(this.state.targetItem);
    });
  }

  render() {
    return (
      <select
        name={'目标物品'}
        value={this.state.targetItem}
        onChange={this.handleChange}
      >
        {Object.keys(allItemNames).map((tier, index) => {
          return (
            <optgroup label={tier} key={index}>
              {allItemNames[tier].map((name, i) => {
                return (
                  <option value={name} key={i}>
                    {name}
                  </option>
                );
              })}
            </optgroup>
          );
        })}
      </select>
    );
  }
}
