const { bidsManagerController } = require("./bids_management.controller");
const { getRoute } = require("../../libs/middlewares/get_route");
const { jwtAuthentication } = require("../../libs/middlewares/jwt_auth");
const { uploadImage } = require("../../libs/middlewares/upload_image");
require("express-group-routes");

exports.bidsManagerRoutes = function (app) {
  app.group("/api/v1/bids_manager/", (router) => {
    router.post("/fetch-bids", [getRoute], bidsManagerController.fetchBids);
    router.post(
      "/get-bid-details",
      [getRoute],
      bidsManagerController.getBidDetails
    );
  });
};
