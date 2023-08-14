const { authController } = require("./auth.controller");
const { getRoute } = require("../../libs/middlewares/get_route");
const { jwtAuthentication } = require("../../libs/middlewares/jwt_auth");
const { uploadImage } = require("../../libs/middlewares/upload_image");
require("express-group-routes");

exports.authRoutes = function (app) {
  app.group("/api/v1/auth/", (router) => {
    router.post("/verify-email", [getRoute], authController.verifyEmail);
    router.post("/verify-code", [getRoute], authController.verifyCode);
    router.post("/register", [getRoute], authController.register);
    router.post("/login", [getRoute], authController.login);
    router.post("/forgot-password", [getRoute], authController.forgotPassword);
    router.post("/update-password", [getRoute], authController.updatePassword);
    router.post(
      "/add-account-details",
      [getRoute],
      authController.addAccountDetails
    );
    router.post("/fetch-accounts", [getRoute], authController.fetchAccounts);
    router.post(
      "/update-account-details",
      [getRoute],
      authController.updateAccountDetails
    );
    router.post(
      "/add-profile-pics",
      [getRoute, uploadImage],
      authController.addProfilePics
    );
    router.post("/add-pin", [getRoute], authController.addTransactionPin);
  });
};
