import React from 'react';
// import { sumReport } from '../main';

interface IProps {
  item: string;
  requiredYieldPerMin: number;
}
interface IState {}

export default class SumReportPanel extends React.Component<IProps, IState> {
  render() {
    return (
      <div>
        <h1>总计</h1>
        {/* {JSON.stringify(
          sumReport(this.props.item, this.props.requiredYieldPerMin),
        )} */}
      </div>
    );
  }
}
