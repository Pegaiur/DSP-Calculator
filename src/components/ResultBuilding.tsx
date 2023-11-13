import React from 'react';
import { Radio, RadioChangeEvent, Avatar } from 'antd';
import Recipe from '@/models/Recipe';
import ItemImageAvatar from './ItemImageAvatar';
import DisplayResult from '@/models/DisplayResult';
import GlobalParameter from '@/models/GlobalParameter';
import _ from 'lodash';

interface IProps {
  result: DisplayResult;
  globalParas: GlobalParameter;
}

interface IState {}

export default class ResultBuilding extends React.Component<IProps, IState> {
  constructor(props: IProps, state: IState) {
    super(props, state);

    this.state = {};
  }

  render() {
    let buildings = this.props.result.buildings(this.props.globalParas);
    const buidling = buildings[0];
    const count = buildings[1];
    return (
      <div>
        <ItemImageAvatar item={buidling} showName={true} /> x{' '}
        <b>{_.ceil(count)}</b> ({count.toFixed(1)})
      </div>
    );
  }
}
