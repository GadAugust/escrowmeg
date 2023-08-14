const Utils = require("../../configs/utils");
const config = require("../../configs/auth");
const paypal = require("paypal-rest-sdk");
const env = require("../../configs/env");
var price = 0;

paypal.configure({
  mode: "sandbox",
  client_id: env.paypal_client_id,
  client_secret: env.paypal_client_secret,
});

const { successful, redirection, client_error, server_error } =
  Utils.status_codes;

exports.paypalController = {
  getPaymentPage: async (req, res) => {
    console.log("Payment page call");
    res.render("index.ejs");
  },

  makePayment: async (req, res) => {
    price = req.body.price;
    console.log("Price = ", price);
    var create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: env.paypal_success_url + price,
        cancel_url: env.paypal_cancel_url,
      },
      transactions: [
        {
          item_list: {
            items: [
              {
                name: "item",
                sku: "item",
                price,
                currency: "USD",
                quantity: 1,
              },
            ],
          },
          amount: {
            currency: "USD",
            total: price,
          },
          description: "This is the payment description.",
        },
      ],
    };

    paypal.payment.create(create_payment_json, function (error, payment) {
      if (error) {
        throw error;
      } else {
        console.log("Create Payment Response");
        console.log(payment);
        res.redirect(payment.links[1].href);
      }
    });
  },

  successPayment: async (req, res) => {
    console.log("Payment is successful", req.query);
    var payerId = req.query.PayerID;
    var paymentId = req.query.paymentId;
    var execute_payment_json = {
      payer_id: payerId,
      transactions: [
        {
          amount: {
            currency: "USD",
            total: price,
          },
        },
      ],
    };

    paypal.payment.execute(
      paymentId,
      execute_payment_json,
      function (error, payment) {
        if (error) {
          console.log(error.response);
          throw error;
        } else {
          console.log("Get Payment Response");
          console.log(JSON.stringify(payment));
          res.render("success.ejs");
        }
      }
    );
  },

  cancelPayment: async (req, res) => {
    console.log("Payment is cancelled");
    res.render("cancel.ejs");
  },
};
