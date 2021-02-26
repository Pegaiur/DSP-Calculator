import React from 'react';
import { Modal, Row, Radio } from 'antd';
import ItemImageAvatar from './ItemImageAvatar';
import { RecipeModel, getRecipe } from '../recipes';
import RecipeEntry from './RecipeEntry';

interface IProps {
  isVisibale: boolean;
  changingRecipeItem: string;
  changingRecipe: RecipeModel;
  onOk(newRecipe: RecipeModel): void;
  onCancel(): void;
}

interface IState {
  selectedRecipe?: RecipeModel;
}

export default class SelectRecipeModal extends React.Component<IProps, IState> {
  constructor(props: IProps, state: IState) {
    super(props, state);

    this.onSelect = this.onSelect.bind(this);

    this.state = {};
  }

  onSelect(recipe: RecipeModel) {
    this.setState({ selectedRecipe: recipe });
  }

  onOKCheck() {
    if (
      this.state.selectedRecipe != undefined &&
      this.state.selectedRecipe != this.props.changingRecipe
    ) {
      this.props.onOk(this.state.selectedRecipe);
      this.setState({ selectedRecipe: undefined });
    } else {
      this.onCancelCheck();
    }
  }

  onCancelCheck() {
    this.setState({ selectedRecipe: undefined }, () => {
      this.props.onCancel();
    });
  }

  render() {
    let recipes = getRecipe(this.props.changingRecipeItem);
    let selectedRecipe = this.props.changingRecipe;
    if (this.state.selectedRecipe != undefined) {
      selectedRecipe = this.state.selectedRecipe;
    }
    return (
      <Modal
        title={
          <Row align="middle">
            <span>更改制造</span>
            <ItemImageAvatar
              item={this.props.changingRecipeItem}
              showName={true}
            />
            <span>的配方？</span>
          </Row>
        }
        cancelText="取消"
        okText="确认更改"
        onOk={() => this.onOKCheck()}
        onCancel={() => this.onCancelCheck()}
        visible={this.props.isVisibale}
        destroyOnClose={true}
      >
        <p>选择要使用的配方</p>
        {recipes.map((recipe, index) => {
          return (
            <RecipeEntry
              recipe={recipe}
              key={index}
              selected={recipe.recipeID == selectedRecipe.recipeID}
              onSelect={this.onSelect}
            />
          );
        })}
      </Modal>
    );
  }
}
