import React from 'react';
import { Mutation } from 'react-apollo';
import styled from 'styled-components';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import { CURRENT_USER_QUERY } from './User';

const REMOVE_FROM_CART_MUTATION = gql`
  mutation removeFromCart($id: ID!) {
    removeFromCart(id: $id) {
      id
    }
  }
`;

const BigButton = styled.button`
  font-size: 3rem;
  background: none;
  border: 0;
  &:hover {
    color: ${props => props.theme.red};
    cursor: pointer;
  }
`;

class RemoveFromCart extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
  };

  // this gets called as soon as we get a response back
  // from the server after a mutation has been performed
  // cache from apollo, payload returned from server
  update = (cache, payload) => {
    // first read the cache
    const data = cache.readQuery({ query: CURRENT_USER_QUERY });
    // remove that item from the cart
    const cartItemId = payload.data.removeFromCart.id;
    data.me.cart = data.me.cart.filter(cartItem => cartItem.id !== cartItemId);
    // write it back to the cache
    cache.writeQuery({ query: CURRENT_USER_QUERY, data });
  };

  render() {
    return (
      <Mutation
        mutation={REMOVE_FROM_CART_MUTATION}
        variables={{ id: this.props.id }}
        update={this.update}
        // remove the item based on what we think will happen
        // removes the item instantly, then sends the response and writes
        // it to the server
        optimisticResponse={{
          __typename: 'Mutation',
          removeFromCart: {
            __typename: 'CartItem',
            id: this.props.id,
          },
        }}
      >
        {(removeFromCart, { loading, error }) => (
          <BigButton
            title="Delete Item"
            disabled={loading}
            onClick={() => {
              removeFromCart().catch(err => alert(err.message));
            }}
          >
            &times;
          </BigButton>
        )}
      </Mutation>
    );
  }
}

export default RemoveFromCart;
