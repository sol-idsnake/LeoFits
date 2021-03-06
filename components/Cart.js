import React from 'react';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { adopt } from 'react-adopt';
import Cartstyles from './styles/Cartstyles';
import Supreme from './styles/Supreme';
import CloseButton from './styles/CloseButton';
import UpdateButton from './styles/UpdateButton';
import User from './User';
import CartItem from './CartItem';
import calcTotalPrice from '../lib/calcTotalPrice';
import moneyFunction from '../lib/formatMoney';
import TakeMyMoney from './TakeMyMoney';

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

const Composed = adopt({
  user: ({ render }) => <User>{render}</User>,
  toggleCart: ({ render }) => (
    <Mutation mutation={TOGGLE_CART_MUTATION}>{render}</Mutation>
  ),
  localState: ({ render }) => <Query query={LOCAL_STATE_QUERY}>{render}</Query>,
});

const Cart = () => (
  <Composed>
    {({ user, toggleCart, localState }) => {
      const { me } = user.data;
      if (!me) return null;
      return (
        <Cartstyles open={localState.data.cartOpen}>
          <header>
            <CloseButton onClick={toggleCart} title="close">
              &times;
            </CloseButton>
            <Supreme>{me.name}&apos;s Cart</Supreme>
            <p>
              You have {me.cart.length} item
              {me.cart.length === 1 ? '' : 's'} in your cart.
            </p>
          </header>
          <ul>
            {me.cart.map(cartItem => (
              <CartItem key={cartItem.id} cartItem={cartItem} />
            ))}
          </ul>
          <footer>
            <p>{moneyFunction(calcTotalPrice(me.cart))}</p>
            {me.cart.length && (
              <TakeMyMoney>
                <UpdateButton>Checkout</UpdateButton>
              </TakeMyMoney>
            )}
          </footer>
        </Cartstyles>
      );
    }}
  </Composed>
);

export default Cart;
export { LOCAL_STATE_QUERY, TOGGLE_CART_MUTATION };
