import React from 'react';
import { Radio, RadioChangeEvent, Avatar } from 'antd';
import Recipe from '@/models/Recipe';
import ItemImageAvatar from './ItemImageAvatar';
import DisplayResult from '@/models/DisplayResult';
import GlobalParameter from '@/models/GlobalParameter';

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
    return (
      <div>
        <ItemImageAvatar
          item={this.props.result.recipe.building.name}
          showName={true}
        />
        x{this.props.result.buildingCount(this.props.globalParas).toFixed(2)}
      </div>
    );
  }
}
