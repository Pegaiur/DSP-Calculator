import React from 'react';
import { TableData } from './ResultList';
import { Radio, RadioChangeEvent } from 'antd';
import { MiningBuilding, calculateBuilding, ProcessBuilding } from '../recipes';

interface IProps {
  data: TableData;
}

interface IState {
  benchType?: BenchEfficiency;
}

enum BenchEfficiency {
  MKI = 0.75,
  MKII = 1,
  MKIII = 1.5,
}

export default class ResultBuilding extends React.Component<IProps, IState> {
  constructor(props: IProps, state: IState) {
    super(props, state);

    this.state = { benchType: BenchEfficiency.MKI };

    this.handleBenchChange = this.handleBenchChange.bind(this);
  }

  handleBenchChange(event: RadioChangeEvent) {
    this.setState({ benchType: event.target.value });
  }

  render() {
    let buildingString = '';
    if (this.props.data.recipe.miningBuilding != undefined) {
      // TODO: mining tech multiplier
      let buildingCount = (
        this.props.data.totalYieldPerMin /
        this.props.data.recipe.miningMultiplier!
      ).toFixed(1);
      if (this.props.data.recipe.miningBuilding != MiningBuilding.miner) {
        buildingString = `${this.props.data.recipe.miningBuilding} x${buildingCount}个`;
      } else {
        buildingString = `${
          Object.keys(this.props.data.recipe.materials)[0]
        } x${buildingCount}个`;
      }
    }

    if (
      this.props.data.recipe.processBuilding != undefined &&
      this.props.data.recipe.processBuilding != ProcessBuilding.bench
    ) {
      let buildingCount = calculateBuilding(
        this.props.data.item,
        this.props.data.recipe,
        this.props.data.totalYieldPerMin,
      ).toFixed(1);
      buildingString = `${this.props.data.recipe.processBuilding} x${buildingCount}个`;
    }

    let benchRadioGroup = (
      <div>
        制造站
        <Radio.Group
          value={this.state.benchType}
          onChange={this.handleBenchChange}
        >
          <Radio.Button value={BenchEfficiency.MKI}>MKI</Radio.Button>
          <Radio.Button value={BenchEfficiency.MKII}>MKII</Radio.Button>
          <Radio.Button value={BenchEfficiency.MKIII}>MKIII</Radio.Button>
        </Radio.Group>
        x
        {(
          calculateBuilding(
            this.props.data.item,
            this.props.data.recipe,
            this.props.data.totalYieldPerMin,
          ) / this.state.benchType!
        ).toFixed(1)}
      </div>
    );
    return (
      <div>
        {buildingString}
        {this.props.data.recipe.processBuilding == ProcessBuilding.bench
          ? benchRadioGroup
          : null}
      </div>
    );
  }
}
