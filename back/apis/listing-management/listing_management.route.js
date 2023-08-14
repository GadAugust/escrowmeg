const {
  listingsManagerController,
} = require("./listing_management.controller");
const { getRoute } = require("../../libs/middlewares/get_route");
const { jwtAuthentication } = require("../../libs/middlewares/jwt_auth");
const { uploadImage } = require("../../libs/middlewares/upload_image");
require("express-group-routes");

exports.listingsManagerRoutes = function (app) {
  app.group("/api/v1/listings_manager/", (router) => {
    router.post(
      "/fetch-listings",
      [getRoute],
      listingsManagerController.fetchListings
    );
    router.post(
      "/search-listings",
      [getRoute],
      listingsManagerController.searchListing
    );
    router.post(
      "/get-listing-details",
      [getRoute],
      listingsManagerController.getListingsDetails
    );
  });
};
