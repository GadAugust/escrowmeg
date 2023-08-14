const { adminController } = require("./admin.controller");
const { getRoute } = require("../../libs/middlewares/get_route");
const { jwtAuthentication } = require("../../libs/middlewares/jwt_auth");
const { uploadImage } = require("../../libs/middlewares/upload_image");
require("express-group-routes");

exports.adminRoutes = function (app) {
  app.group("/api/v1/admin/", (router) => {
    router.post("/register-admin", [getRoute], adminController.registerAdmin);
    router.post("/login-admin", [getRoute], adminController.loginAdmin);
    router.post("/list-admins", [getRoute], adminController.listAdmins);
    router.post("/forgot-password", [getRoute], adminController.forgotPassword);
    router.post("/verify-code", [getRoute], adminController.verifyCode);
    router.post("/update-password", [getRoute], adminController.updatePassword);
  });
};
