const { walletController } = require("./wallet.controller");
const { getRoute } = require("./../../libs/middlewares/get_route");
const { jwtAuthentication } = require("./../../libs/middlewares/jwt_auth");
require("express-group-routes");

exports.walletRoutes = (app) => {
  app.group("/api/v1/wallet/", (router) => {
    router.post("/transactions", [getRoute], walletController.transactions);
    router.post("/add-money", [getRoute], walletController.addMoney);
    router.post("/withdraw", [getRoute], walletController.withdraw);
  });
};
