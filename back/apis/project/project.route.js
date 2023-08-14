const { projectController } = require("./project.controller");
const { getRoute } = require("../../libs/middlewares/get_route");
const { uploadImage } = require("../../libs/middlewares/upload_image");
const { jwtAuthentication } = require("../../libs/middlewares/jwt_auth");
require("express-group-routes");

exports.projectRoutes = (app) => {
  app.group("/api/v1/project/", (router) => {
    router.post(
      "/fetch-ongoing-projects",
      [getRoute],
      projectController.getOngoingProject
    );
    router.post(
      "/fetch-complete-projects",
      [getRoute],
      projectController.getCompleteProject
    );
    router.post(
      "/raise-dispute",
      [getRoute, uploadImage],
      projectController.raiseDispute
    );
    router.post(
      "/request-payment",
      [getRoute],
      projectController.requestPayment
    );
    router.post(
      "/request-payment-history",
      [getRoute],
      projectController.requestPaymentHistory
    );
    router.post("/send-message", [getRoute], projectController.sendMessage);
    router.post("/fetch-messages", [getRoute], projectController.fetchMessages);
    router.post("/fetch-disputes", [getRoute], projectController.fetchDisputes);
    router.post(
      "/decline-request-payment",
      [getRoute],
      projectController.declineRequestPayment
    );
    router.post(
      "/accept-request-payment",
      [getRoute],
      projectController.acceptRequestPayment
    );
    router.post("/release-fund", [getRoute], projectController.releaseFund);
    router.post(
      "/create-settings",
      [getRoute],
      projectController.createSettings
    );
  });
};
