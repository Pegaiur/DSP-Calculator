import styles from './RecipeEntry.less';

import Recipe, { CompactRecipe } from '@/models/Recipe';
import { Row, Col } from 'antd';
import React from 'react';
import ItemImageAvatar from './ItemImageAvatar';
import { SwapRightOutlined } from '@ant-design/icons';

interface IProps {
  recipe: Recipe;
  selected: boolean;
  onSelect(recipe: Recipe): void;
  className?: string;
}

interface IState {}

export default class RecipeEntry extends React.Component<IProps, IState> {
  constructor(props: IProps, state: IState) {
    super(props, state);

    this.state = {};
  }

  renderRow(recipe: CompactRecipe) {
    return (
      <Row
        className={this.props.selected ? styles.selectedRow : styles.normalRow}
        justify="start"
        align="middle"
        onClick={() => this.props.onSelect(this.props.recipe)}
      >
        {Object.keys(recipe.materials).map((material, index) => {
          return (
            <Col span={3} key={index}>
              <ItemImageAvatar
                item={material}
                badgeNumber={recipe.materials[material]}
              />
            </Col>
          );
        })}
        <SwapRightOutlined style={{ fontSize: '32px' }} />
        {Object.keys(recipe.products).map((product, index) => {
          return (
            <Col span={3} key={index}>
              <ItemImageAvatar
                item={product}
                badgeNumber={recipe.products[product]}
              />
            </Col>
          );
        })}
        <span>({recipe.time}秒)</span>
      </Row>
    );
  }

  render() {
    let calculateRecipe: CompactRecipe = this.props.recipe;
    if (this.props.recipe.equivalentRecipe != undefined) {
      calculateRecipe = this.props.recipe.equivalentRecipe;
    }
    return (
      <div className={this.props.className}>
        {this.renderRow(this.props.recipe)}
        {this.props.recipe.equivalentRecipe != undefined ? (
          <div>
            <span>等效计算配方：</span>
            {this.renderRow(calculateRecipe)}
          </div>
        ) : null}
      </div>
    );
  }
}
