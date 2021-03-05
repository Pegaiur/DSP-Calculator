import DisplayResult from '@/models/DisplayResult';
import React from 'react';

interface IProps {
  result: DisplayResult;
}

interface IState {}

export default class ResultDetail extends React.Component<IProps, IState> {
  constructor(props: IProps, state: IState) {
    super(props, state);

    this.state = {};
  }

  render() {
    let consumptions = Object.keys(this.props.result.consumptionDetail).map(
      (product) => {
        return `${product} 消耗了 ${this.props.result.consumptionDetail[
          product
        ].toFixed(1)} 产量`;
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
