const { settingsController } = require("./settings.controller");
const { getRoute } = require("../../libs/middlewares/get_route");
const { uploadImage } = require("../../libs/middlewares/upload_image");
const { jwtAuthentication } = require("../../libs/middlewares/jwt_auth");
require("express-group-routes");

exports.settingsRoutes = (app) => {
  app.group("/api/v1/settings/", (router) => {
    router.post(
      "/change-password",
      [getRoute],
      settingsController.changePassword
    );
    router.post("/change-pin", [getRoute], settingsController.changePin);
    router.post("/forgot-pin", [getRoute], settingsController.forgotPin);
    router.post("/update-pin", [getRoute], settingsController.updatePin);
  });
};
