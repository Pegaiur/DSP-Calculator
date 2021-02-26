import styles from './RecipeEntry.less';

import { RecipeModel } from '@/recipes';
import { Row, Col } from 'antd';
import React from 'react';
import ItemImageAvatar from './ItemImageAvatar';
import { SwapRightOutlined } from '@ant-design/icons';

interface IProps {
  recipe: RecipeModel;
  selected: boolean;
  onSelect(recipe: RecipeModel): void;
}

interface IState {}

export default class RecipeEntry extends React.Component<IProps, IState> {
  constructor(props: IProps, state: IState) {
    super(props, state);

    this.state = {};
  }

  render() {
    return (
      <Row
        className={this.props.selected ? styles.selectedRow : ''}
        justify="start"
        align="middle"
        onClick={() => this.props.onSelect(this.props.recipe)}
      >
        {Object.keys(this.props.recipe.materials).map((material, index) => {
          return (
            <Col span={3} key={index}>
              <ItemImageAvatar
                item={material}
                badgeNumber={this.props.recipe.materials[material]}
              />
            </Col>
          );
        })}
        <SwapRightOutlined style={{ fontSize: '32px' }} />
        {Object.keys(this.props.recipe.products).map((product, index) => {
          return (
            <Col span={3} key={index}>
              <ItemImageAvatar
                item={product}
                badgeNumber={this.props.recipe.products[product]}
              />
            </Col>
          );
        })}
        <span>({this.props.recipe.time}秒)</span>
      </Row>
    );
  }
}
