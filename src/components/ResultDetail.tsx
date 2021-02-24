import React from 'react';
import { TableData } from './ResultList';

interface IProps {
  data: TableData;
}

interface IState {}

export default class ResultDetail extends React.Component<IProps, IState> {
  constructor(props: IProps, state: IState) {
    super(props, state);

    this.state = {};
  }

  render() {
    let consumptions = Object.keys(this.props.data.consumptionDetail).map(
      (product) => {
        return `${product} 消耗了 ${this.props.data.consumptionDetail[product]} 产量`;
      },
    );
    return (
      <div>
        {consumptions.map((consumption, index) => {
          return (
            <p style={{ margin: 0 }} key={index}>
              {consumption}
            </p>
          );
        })}
      </div>
    );
  }
}
