import styles from './ItemImageAvatar.less';

import { Avatar, Space } from 'antd';
import React from 'react';
import itemImagesJSON from '../icon-index.json';

const itemImages: { [item: string]: string } = itemImagesJSON.data;

interface IProps {
  item: string;
  showName?: boolean;
  size?: number;
  badgeNumber: number;
}

interface IState {}

export default class ItemImageAvatar extends React.Component<IProps, IState> {
  static defaultProps = {
    showName: false,
    size: 40,
    badgeNumber: 0,
  };

  constructor(props: IProps, state: IState) {
    super(props, state);

    this.state = {};
  }

  render() {
    return (
      <Space align="center">
        <div>
          <Avatar
            shape="square"
            size={this.props.size}
            src={
              <img
                id={styles.itemImage}
                src={
                  itemImages[this.props.item] +
                  `?x-oss-process=image/resize,l_${this.props.size},m_lfit`
                }
              />
            }
          />
          {this.props.badgeNumber > 0 ? (
            <sub>{' ' + this.props.badgeNumber}</sub>
          ) : null}
        </div>
        {this.props.showName ? <span>{this.props.item}</span> : null}
      </Space>
    );
  }
}
