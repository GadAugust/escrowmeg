const {
  disputesManagerController,
} = require("./dispute_management.controller");
const { getRoute } = require("../../libs/middlewares/get_route");
const { jwtAuthentication } = require("../../libs/middlewares/jwt_auth");
const { uploadImage } = require("../../libs/middlewares/upload_image");
require("express-group-routes");

exports.disputesManagerRoutes = function (app) {
  app.group("/api/v1/disputes_manager/", (router) => {
    router.post(
      "/fetch-disputes",
      [getRoute],
      disputesManagerController.fetchDisputes
    );
  });
};
