import React from "react";
import StripeCheckout from 'react-stripe-checkout';
// import { Notification, Message } from "element-react";

const stripeConfig = {
  currency: "USD",
  publishableAPIKey: "pk_test_QREVHSBFyM21NjYBhGpnef9U"
}

const PayButton = ({ product, user }) => {
  return (
    <StripeCheckout 
      email={user.attributes.email}
      name={product.description}
      amount={product.price}
      shippingAddress={product.shipped}
      billingAddress={product.shipped}
      currency={stripeConfig.currency}
      locale="auto"
      stripeKey={stripeConfig.publishableAPIKey}
    />
  )
};

export default PayButton;
