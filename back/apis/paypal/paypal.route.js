const { paypalController } = require("./paypal.controller");
const { getRoute } = require("../../libs/middlewares/get_route");
const { jwtAuthentication } = require("../../libs/middlewares/jwt_auth");
require("express-group-routes");

exports.paypalRoutes = (app) => {
  app.group("/api/v1/paypal/", (router) => {
    router.get("/payment-page", [getRoute], paypalController.getPaymentPage);
    router.post("/make-payment", [getRoute], paypalController.makePayment);
    router.get("/success/:price", [getRoute], paypalController.successPayment);
    router.get("/cancel", [getRoute], paypalController.cancelPayment);
  });
};
