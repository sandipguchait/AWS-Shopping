import React from "react";
import StripeCheckout from 'react-stripe-checkout';
import { API } from 'aws-amplify';
// import { Notification, Message } from "element-react";

const stripeConfig = {
  currency: "USD",
  publishableAPIKey: "pk_test_QREVHSBFyM21NjYBhGpnef9U"
}

const PayButton = ({ product, user }) => {
  const handleCharge = async token => {
    //Using Lambds function making backend a post request to '/charge'
    //using post to post stripe payment data from frontend to backend -> posting
  
    try {
     const result =  await API.post('orderlambda', '/charge', { 
        body: {
          token
        }
      })
      console.log(result);
    } catch(err) {
      console.error(err)
    }
  }

  return (
    <StripeCheckout 
      token={handleCharge}
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
