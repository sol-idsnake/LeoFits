import React from 'react';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Cartstyles from './styles/Cartstyles';
import Supreme from './styles/Supreme';
import CloseButton from './styles/CloseButton';
import UpdateButton from './styles/UpdateButton';

const LOCAL_STATE_QUERY = gql`
  query {
    cartOpen @client
  }
`;

const TOGGLE_CART_MUTATION = gql`
  mutation {
    toggleCart @client
  }
`;

const Cart = () => (
  <Mutation mutation={TOGGLE_CART_MUTATION}>
    {toggleCart => (
      <Query query={LOCAL_STATE_QUERY}>
        {({ data }) => (
          <Cartstyles open={data.cartOpen}>
            <header>
              <CloseButton onClick={toggleCart} title="close">
                &times;
              </CloseButton>
              <Supreme>Your Cart</Supreme>
              <p>You have ++ items in your cart.</p>
            </header>
            <footer>
              <p>$12.09</p>
              <UpdateButton>Checkout</UpdateButton>
            </footer>
          </Cartstyles>
        )}
      </Query>
    )}
  </Mutation>
);

export default Cart;
export { LOCAL_STATE_QUERY, TOGGLE_CART_MUTATION };
