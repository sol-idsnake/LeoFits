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

function totalItems(cart) {
  return cart.reduce((tally, cartItem) => tally + cartItem.quantity, 0);
}

export class TakeMyMoney extends Component {
  render() {
    const { children } = this.props;
    return (
      <User>
        {({ data: { me } }) => (
          <StripeCheckout
            // https://github.com/azmenak/react-stripe-checkout#send-all-the-props
            // always have to send Cents to stripe
            amount={calcTotalPrice(me.cart)}
            name="LEO Fits"
            description={`Order of ${totalItems(me.cart)} items!`}
            stripeKey={process.env.STRIPE_KEY}
          >
            {children}
          </StripeCheckout>
        )}
      </User>
    );
  }
}

export default TakeMyMoney;
