import styles from './ItemImageAvatar.less';

import React from 'react';
import { TableData } from './ResultList';
import { Radio, RadioChangeEvent, Avatar } from 'antd';
import { MiningBuilding, calculateBuilding, ProcessBuilding } from '../recipes';
import itemImagesJSON from '../icon-index.json';

const itemImages: { [item: string]: string } = itemImagesJSON.data;

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
        buildingString = `${this.props.data.recipe.miningBuilding} x${buildingCount}`;
        buildingImageString = this.props.data.recipe.miningBuilding;
      } else {
        buildingString = `${
          Object.keys(this.props.data.recipe.materials)[0]
        } x${buildingCount}`;
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
      buildingString = `${this.props.data.recipe.processBuilding} x${buildingCount}个`;
      buildingImageString = this.props.data.recipe.processBuilding;
    }

    let benchRadioGroup = (
      <div>
        <Avatar
          shape="square"
          size={40}
          src={
            <img
              id={styles.itemImage}
              src={
                itemImages[`制造台${this.state.benchType}`] +
                '?x-oss-process=image/resize,l_40,m_lfit'
              }
            />
          }
        />
        制造台
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
          <Avatar
            shape="square"
            size={40}
            src={
              <img
                id={styles.itemImage}
                src={
                  itemImages[buildingImageString] +
                  '?x-oss-process=image/resize,l_40,m_lfit'
                }
              />
            }
          />
        )}
        {buildingString}
        {this.props.data.recipe.processBuilding == ProcessBuilding.bench
          ? benchRadioGroup
          : null}
      </div>
    );
  }
}
