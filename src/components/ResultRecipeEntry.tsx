import { RecipeModel } from '@/recipes';
import { Row, Col } from 'antd';
import React from 'react';
import ItemImageAvatar from './ItemImageAvatar';

interface IProps {
  items: { [item: string]: number };
}

interface IState {}

export default class ResultRecipeEntry extends React.Component<IProps, IState> {
  constructor(props: IProps, state: IState) {
    super(props, state);

    this.state = {};
  }

  render() {
    return (
      <Row justify="start">
        {Object.keys(this.props.items).map((item, index) => {
          return (
            <Col span={3} key={index}>
              <ItemImageAvatar
                item={item}
                badgeNumber={this.props.items[item]}
              />
            </Col>
          );
        })}
      </Row>
    );
  }
}
