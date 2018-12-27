import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { ALL_ITEMS_QUERY } from './Items';

const DELETE_ITEM_MUTATION = gql`
  mutation DELETE_ITEM_MUTATION($id: ID!) {
    deleteItem(id: $id) {
      id
    }
  }
`;

class DeleteItem extends Component {
  // function responsible for showing updated inventory after deleting item
  update = (cache, payload) => {
    // manually update the cache on client to match server
    // 1. read cache for items we want
    const data = cache.readQuery({ query: ALL_ITEMS_QUERY });
    // console.log(data, payload);
    // filter the deleted item out of page
    data.items = data.items.filter(
      item => item.id !== payload.data.deleteItem.id
    );
    // put the items back!
    cache.writeQuery({ query: ALL_ITEMS_QUERY, data });
  };

  render() {
    const { children, id } = this.props;

    return (
      <Mutation
        mutation={DELETE_ITEM_MUTATION}
        variables={{ id }}
        update={this.update}
      >
        {(deleteItem, { error }) => (
          <button
            type="submit"
            onClick={() => {
              if (confirm('Confirm the removal of this item')) {
                deleteItem();
              }
            }}
          >
            {children}
          </button>
        )}
      </Mutation>
    );
  }
}

export default DeleteItem;
