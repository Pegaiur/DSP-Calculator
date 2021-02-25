import styles from './ItemImageAvatar.less';

import { RecipeModel } from '@/recipes';
import { Row, Col, Avatar } from 'antd';
import React from 'react';
import itemImagesJSON from '../icon-index.json';

const itemImages: { [item: string]: string } = itemImagesJSON.data;

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
              <Avatar
                shape="square"
                size={40}
                src={
                  <img
                    id={styles.itemImage}
                    src={
                      itemImages[item] +
                      '?x-oss-process=image/resize,l_40,m_lfit'
                    }
                  />
                }
              />
              x{this.props.items[item]}
            </Col>
          );
        })}
      </Row>
    );
  }
}
