const { listingController } = require("./listing.controller");
const { getRoute } = require("../../libs/middlewares/get_route");
const { jwtAuthentication } = require("../../libs/middlewares/jwt_auth");
require("express-group-routes");

exports.listingRoutes = (app) => {
  app.group("/api/v1/listing/", (router) => {
    router.post("/create-listing", [getRoute], listingController.addListing);
    router.post("/fetch-listings", [getRoute], listingController.getListings);
    router.post(
      "/fetch-listings-with-bids",
      [getRoute],
      listingController.getListingsWithBids
    );
    router.post(
      "/fetch-all-listings",
      [getRoute],
      listingController.getAllListings
    );
    router.post(
      "/search-listings",
      [getRoute],
      listingController.searchListings
    );
    router.post("/bid", [getRoute], listingController.addBid);
    router.post(
      "/fetch-listing-bids",
      [getRoute],
      listingController.getListingBids
    );
    router.post("/fetch-my-bids", [getRoute], listingController.getMyBids);
    router.post("/decline-bid", [getRoute], listingController.declineBid);
    router.post("/accept-bid", [getRoute], listingController.acceptBid);
  });
};
