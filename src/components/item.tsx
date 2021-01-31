import React from 'react';
import { ItemModel, getMaterial } from '../main';

export class ItemEntry extends React.Component {
  constructor(props: ItemModel) {
    super(props);
  }

  render() {
    return (
      <div>
        <h3>
          {this.props.item.name} 产量: {this.props.requiredYieldPerMin}/分钟
        </h3>
        {this.props.item.materials.map((material, index) => {
          if (getMaterial(material) != undefined) {
            return (
              <ItemEntry
                item={getMaterial(material)}
                requiredYieldPerMin={
                  (this.props.requiredYieldPerMin /
                    this.props.item.yieldPerMin) *
                  material.requiredYieldPerMin
                }
                key={index}
              />
            );
          }
        })}
      </div>
    );
  }
}
