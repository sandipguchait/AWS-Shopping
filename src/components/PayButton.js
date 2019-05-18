import React from "react";
import StripeCheckout from 'react-stripe-checkout';
import { API, graphqlOperation } from 'aws-amplify';
import { getUser } from '../graphql/queries';
import { Notification, Message } from "element-react";

const stripeConfig = {
  currency: "USD",
  publishableAPIKey: "pk_test_QREVHSBFyM21NjYBhGpnef9U"
}

const PayButton = ({ product, user }) => {

  //Getting OwnerEmail
  const getOwnerEmail = async ownerId => {
    try{
      const input = { id: ownerId };
      const result = await API.graphql(graphqlOperation(getUser, { input } ))
      return result.data.getUser.id
    } catch (err) {
      console.error('Error fetching Product Owner Email', err)
    }
  }

  const handleCharge = async token => {
    //Using Lambds function making backend a post request to '/charge'
    //using post to post stripe payment data from frontend to backend -> posting
    //orderlambda is the name of the function on backend
    try {
      const ownerEmail = await getOwnerEmail(product.owner)
      console.log({ ownerEmail })
      const result =  await API.post('orderlambda', '/charge', { 
       //Details that are send to the backend
        body: {
          token,
          charge: {
            currency: stripeConfig.currency,
            amount: product.price,
            description: product.description
          },
          email: {
            customerEmail: user.attributes.email,
            ownerEmail,
            shipped: product.shipped
          }
        }
      })
      Notification({
        title: "Success",
        message: "Successfully Ordered",
        type:"success"
      })
    } catch(err) {
      Notification.error({
        title: "error",
        message: "Payment Failed",
        type:"error"
      })
    }
  };

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
