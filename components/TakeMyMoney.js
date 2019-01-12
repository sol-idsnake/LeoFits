import React, { Component } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import { Mutation } from 'react-apollo';
import Router from 'next/router';
import NProgress from 'nprogress';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import calcTotalPrice from '../lib/calcTotalPrice';
import Error from './ErrorMessage';
import User, { CURRENT_USER_QUERY } from './User';

const CREATE_ORDER_MUTATION = gql`
  mutation createOrder($token: String!) {
    createOrder(token: $token) {
      id
      charge
      total
      items {
        id
        title
      }
    }
  }
`;

function totalItems(cart) {
  return cart.reduce((tally, cartItem) => tally + cartItem.quantity, 0);
}

export class TakeMyMoney extends Component {
  onToken(res, createOrder) {
    // https://stripe.com/docs/testing#cards
    console.log(this.res);
    // manually call the mutation once we have the stripe token
    createOrder({
      variables: {
        token: res.id,
      },
    }).catch(err => {
      alert(err.message);
    });
  }

  render() {
    const { children } = this.props;
    return (
      <User>
        {({ data: { me } }) => (
          <Mutation
            mutation={CREATE_ORDER_MUTATION}
            refetchQueries={[{ query: CURRENT_USER_QUERY }]}
          >
            {createOrder => (
              <StripeCheckout
                // https://github.com/azmenak/react-stripe-checkout#send-all-the-props
                // always have to send Cents to stripe
                amount={calcTotalPrice(me.cart)}
                image={me.cart[0].item && me.cart[0].item.image}
                name="LEO Fits"
                description={`Order of ${totalItems(me.cart)} items!`}
                stripeKey="pk_test_8QLFclj8SDmalnV6Jl1s9XG0"
                currency="USD"
                email={me.email}
                token={res => this.onToken(res, createOrder)}
              >
                {children}
              </StripeCheckout>
            )}
          </Mutation>
        )}
      </User>
    );
  }
}

export default TakeMyMoney;
