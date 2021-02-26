import React from 'react';
import { TableData } from './ResultList';
import { Radio, RadioChangeEvent, Avatar } from 'antd';
import { MiningBuilding, calculateBuilding, ProcessBuilding } from '../recipes';
import ItemImageAvatar from './ItemImageAvatar';

interface IProps {
  data: TableData;
}

interface IState {
  benchType?: BenchType;
}

enum BenchType {
  MKI = 'MKI',
  MKII = 'MKII',
  MKIII = 'MKIII',
}

const benchEfficiency = {
  MKI: 0.75,
  MKII: 1,
  MKIII: 1.5,
};

export default class ResultBuilding extends React.Component<IProps, IState> {
  constructor(props: IProps, state: IState) {
    super(props, state);

    this.state = { benchType: BenchType.MKI };

    this.handleBenchChange = this.handleBenchChange.bind(this);
  }

  handleBenchChange(event: RadioChangeEvent) {
    this.setState({ benchType: event.target.value });
  }

  render() {
    let buildingString = '';
    let buildingImageString = '';
    if (this.props.data.recipe.miningBuilding != undefined) {
      // TODO: mining tech multiplier
      let buildingCount = (
        this.props.data.totalYieldPerMin /
        this.props.data.recipe.miningMultiplier!
      ).toFixed(1);
      if (
        this.props.data.recipe.miningBuilding != MiningBuilding.miner &&
        this.props.data.recipe.miningBuilding != MiningBuilding.oilWell
      ) {
        buildingString = ` x${buildingCount}`;
        buildingImageString = this.props.data.recipe.miningBuilding;
      } else {
        buildingString = ` x${buildingCount}`;
        buildingImageString = Object.keys(this.props.data.recipe.materials)[0];
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
      buildingString = ` x${buildingCount}`;
      buildingImageString = this.props.data.recipe.processBuilding;
    }

    let benchRadioGroup = (
      <div>
        <ItemImageAvatar
          item={`制造台${this.state.benchType}`}
          showName={true}
        />
        <Radio.Group
          value={this.state.benchType}
          onChange={this.handleBenchChange}
        >
          <Radio.Button value={BenchType.MKI}>MKI</Radio.Button>
          <Radio.Button value={BenchType.MKII}>MKII</Radio.Button>
          <Radio.Button value={BenchType.MKIII}>MKIII</Radio.Button>
        </Radio.Group>
        x
        {(
          calculateBuilding(
            this.props.data.item,
            this.props.data.recipe,
            this.props.data.totalYieldPerMin,
          ) / benchEfficiency[this.state.benchType!]
        ).toFixed(1)}
      </div>
    );
    return (
      <div>
        {this.props.data.recipe.processBuilding ==
        ProcessBuilding.bench ? null : (
          <ItemImageAvatar item={buildingImageString} showName={true} />
        )}
        {buildingString}
        {this.props.data.recipe.processBuilding == ProcessBuilding.bench
          ? benchRadioGroup
          : null}
      </div>
    );
  }
}
