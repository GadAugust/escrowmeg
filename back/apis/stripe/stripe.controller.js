const Utils = require("../../configs/utils");
const config = require("../../configs/auth");
const env = require("../../configs/env");
const stripe = require("stripe")(env.stripe_client_id);

const { successful, redirection, client_error, server_error } =
  Utils.status_codes;

exports.stripeController = {
  createIntent: async (req, res) => {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: "usd",
        automatic_payment_methods: {
          enabled: true,
        },
      });
      res
        .status(successful.created)
        .send({ paymentIntent: paymentIntent.client_secret });
    } catch (e) {
      res.status(client_error.forbidden).send({ error: e.message });
    }
  },
};
