import { RecipeModel } from '@/recipes';
import { Row, Col } from 'antd';
import React from 'react';

interface IProps {
  recipe: RecipeModel;
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
        {Object.keys(this.props.recipe.materials).map((material, index) => {
          return (
            <Col span={2} key={index}>
              {material} x {this.props.recipe.materials[material]}
            </Col>
          );
        })}
        <Col span={2}>--{this.props.recipe.time}秒--</Col>
        {Object.keys(this.props.recipe.products).map((product, index) => {
          return (
            <Col span={2} key={index}>
              {product} x {this.props.recipe.products[product]}
            </Col>
          );
        })}
      </Row>
    );
  }
}
