var express = require('express')
var bodyParser = require('body-parser')
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
require('dotenv').config()
var stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
var AWS = require("aws-sdk")

const config = {
  accessKeyId: "AKIAIXOCUYBUE6R5S7XQ",
  secretAccessKey: "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",
  region: "us-west-2",
  adminEmail: "senzakash101@gmail.com"
};

// Sending Email Service from AWS
var ses = new AWS.SES(config)

// declare a new express app
var app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
});


// CHARGING FUNCTION TO CHARGE USING STRIPE
const chargeHandler = async (req, res, next) => {
  const {
    token
  } = req.body;
  const {
    currency,
    amount,
    description
  } = req.body.charge;

  try {
    const charge = await stripe.charges.create({
      source: token.id,
      amount,
      currency,
      description
    })
    if (charge.status === "succeeded") {
      //Sending details to next middleware
      req.charge = charge;
      req.description = description;
      req.email = req.body.email;
      next();
    }
  } catch (err) {
    res.status(500).json({
      error: err
    })
  }
};

const convertCentsToDollars = price => ( price / 100).toFixed(2);

// EMAIL SENDING TO USERS
const emailHandler = (req, res) => {
  const {
    charge, description, email: { shipped, customerEmail, ownerEmail}
  } = req;

  ses.sendEmail({
    Source: config.adminEmail,
    ReturnPath: config.adminEmail,
    Destination: {
      ToAddresses: [config.adminEmail]
    },
    Message: {
      Subject: {
        Data: ' Order Details - AWS-SHOPPING'
      },
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: `
            <h3>Order Processed</h3>
            <p><span style="font-weight: bold" >${description}</span> - $${convertCentsToDollars(charge.amount)}</p>
            <p>Customer Email: <a href="mailto:${customerEmail}">${customerEmail}</a></p>
            <p>Contact your seller: <a href="mailto:${ownerEmail}">${ownerEmail}</a></p>

            ${ shipped ? 
               `<h4>Mailing Address</h4>
               <p>${charge.source.name}</p>
               <p>${charge.source.address_line1}</p>
               <p>${charge.source.address_city}, ${charge.source.address_state} ${charge.source.address_zip}</p>
               ` : "Emailed Product"
            }

            <p style="font-style: italic; color: grey;">
              ${ shipped ? 
                  'Your product will be shipped in 2-3 days':
                  'Check your verified email for your emailed product'
              }
            </p>
          `
        }
      }
    }
  }, (err, data) => {
    if (err) return res.status(500).json({
      error: err
    })
    res.json({
      message: "Order Processed Successfully",
      charge,
      data
    });
  })
};

//Post request with two middlewares
app.post('/charge', chargeHandler, emailHandler);


/****************************
 * Example post method *
 ****************************/


app.listen(3000, function () {
  console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app