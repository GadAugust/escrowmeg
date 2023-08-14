const { stripeController } = require("./stripe.controller");
const { getRoute } = require("../../libs/middlewares/get_route");
const { jwtAuthentication } = require("../../libs/middlewares/jwt_auth");
require("express-group-routes");

exports.stripeRoutes = (app) => {
  app.group("/api/v1/stripe/", (router) => {
    router.post("/intent", [getRoute], stripeController.createIntent);
  });
};
