import styles from './ItemImageAvatar.less';

import { RecipeModel } from '@/recipes';
import { Row, Col, Avatar } from 'antd';
import React from 'react';
import itemImagesJSON from '../icon-index.json';

const itemImages: { [item: string]: string } = itemImagesJSON.data;

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
              <Avatar
                shape="square"
                size={40}
                src={
                  <img
                    id={styles.itemImage}
                    src={
                      itemImages[material] +
                      '?x-oss-process=image/resize,l_40,m_lfit'
                    }
                  />
                }
              />
              x{this.props.recipe.materials[material]}
            </Col>
          );
        })}
        <Col span={2}>-{this.props.recipe.time}秒-</Col>
        {Object.keys(this.props.recipe.products).map((product, index) => {
          return (
            <Col span={2} key={index}>
              <Avatar
                shape="square"
                size={40}
                src={
                  <img
                    id={styles.itemImage}
                    src={
                      itemImages[product] +
                      '?x-oss-process=image/resize,l_40,m_lfit'
                    }
                  />
                }
              />
              x{this.props.recipe.products[product]}
            </Col>
          );
        })}
      </Row>
    );
  }
}
