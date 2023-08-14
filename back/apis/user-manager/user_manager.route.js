const { userManagerController } = require("./user_manager.controller");
const { getRoute } = require("../../libs/middlewares/get_route");
const { jwtAuthentication } = require("../../libs/middlewares/jwt_auth");
const { uploadImage } = require("../../libs/middlewares/upload_image");
require("express-group-routes");

exports.userManagerRoutes = function (app) {
  app.group("/api/v1/user_manager/", (router) => {
    router.post(
      "/summary",
      [getRoute],
      userManagerController.fetchAdminSummary
    );

    router.post(
      "/user-summary",
      [getRoute],
      userManagerController.userDashboard
    );

    router.post(
      "/fetch-users",
      [getRoute],
      userManagerController.fetchAllUsers
    );
    router.post("/search-users", [getRoute], userManagerController.searchUser);
    router.post(
      "/fetch-users-for-each-month",
      [getRoute],
      userManagerController.fetchUserForEachMonth
    );
    router.post(
      "/fetch-payout-for-each-month",
      [getRoute],
      userManagerController.fetchPayoutForEachMonth
    );
    router.post(
      "/fetch-listings",
      [getRoute],
      userManagerController.fetchUserListings
    );
    router.post(
      "/fetch-projects",
      [getRoute],
      userManagerController.fetchUserProjects
    );
    router.post("/fetch-bids", [getRoute], userManagerController.fetchUserBids);
    router.post(
      "/amount-payment-requested",
      [getRoute],
      userManagerController.PaymentsRequested
    );
    router.post(
      "/amount-payment-released",
      [getRoute],
      userManagerController.PaymentsReleased
    );
  });
};
