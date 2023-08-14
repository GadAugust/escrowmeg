const { listingController, listingModel } = require("./listing.model");
const { projectModel } = require("./../project/project.model");
const Utils = require("../../configs/utils");
const config = require("../../configs/auth");
const transactions = require("../../models/wallet/transactions");
const uuid4 = require("uuid4");

const { successful, redirection, client_error, server_error } =
  Utils.status_codes;

exports.listingController = {
  addListing: (req, res) => {
    let id = uuid4();
    let listingData = req.body;
    listingData.listing_id = id;
    listingModel.addListing(listingData).then(
      (resp) => {
        if (resp.dataValues) {
          res
            .status(successful.created)
            .send({ message: "Listing added successful" });
        } else {
          res
            .status(successful.no_content)
            .send({ message: "Listing failed to add" });
        }
      },
      (error) => {
        console.log(error);
        res.status(server_error.internal_server_error).send({ message: error });
      }
    );
  },
  getListings: (req, res) => {
    listingModel.getListings(req.body).then(
      (resp) => {
        console.log("My listings", resp);
        if (resp.length > 0) {
          res.status(successful.ok).send({ data: resp });
        } else {
          res.status(successful.no_content).send({ data: [] });
        }
      },
      (error) => {
        console.log(error);
        res.status(server_error.internal_server_error).send({ message: error });
      }
    );
  },

  getListingsWithBids: (req, res) => {
    listingModel.getListingsWithBids(req.body).then(
      (resp) => {
        console.log(resp);
        if (resp) {
          res.status(successful.ok).send({ data: resp });
        } else {
          res.status(successful.no_content).send({ data: [] });
        }
      },
      (error) => {
        console.log(error);
        res.status(server_error.internal_server_error).send({ message: error });
      }
    );
  },

  getAllListings: (req, res) => {
    listingModel.getAllListings().then(
      (resp) => {
        if (resp.length > 0) {
          // console.log(resp);
          listingModel.getEachListingDetails(resp).then((result) => {
            res.status(successful.ok).send({ data: result });
          });
        } else {
          res.status(successful.no_content).send({ data: [] });
        }
      },
      (error) => {
        console.log(error);
        res.status(server_error.internal_server_error).send({ message: error });
      }
    );
  },
  searchListings: (req, res) => {
    let searchWord = req.body["listing_id"];
    listingModel.searchListings(searchWord).then(
      (resp) => {
        if (resp.length == 0) {
          res.status(successful.no_content).send({ data: [] });
        } else {
          listingModel.getEachListingDetails(resp).then((result) => {
            res.status(successful.ok).send({ data: result });
          });
        }
      },
      (error) => {
        console.log(error);
        res.status(server_error.internal_server_error).send({ message: error });
      }
    );
  },
  addBid: (req, res) => {
    listingModel.addBid(req.body).then(
      (resp) => {
        console.log(resp);
        if (resp.message == "Found") {
          res
            .status(client_error.not_acceptable)
            .send({ message: "Buyer already bidded for product" });
        } else if (resp.dataValues) {
          res
            .status(successful.ok)
            .send({ message: "Bid created successfully" });
        } else {
          res
            .status(server_error.internal_server_error)
            .send({ message: "Server error" });
        }
      },
      (error) => {
        console.log(error);
        res.status(server_error.internal_server_error).send({ message: error });
      }
    );
  },
  getListingBids: (req, res) => {
    listingModel.getListingBids(req.body).then(
      (resp) => {
        if (resp.length > 0) {
          res.status(successful.ok).send({ data: resp });
        } else {
          res.status(successful.no_content).send({ data: [] });
        }
      },
      (error) => {
        console.log(error);
        res.status(server_error.internal_server_error).send({ message: error });
      }
    );
  },
  getMyBids: (req, res) => {
    listingModel.getMyBids(req.body).then(
      (resp) => {
        if (resp.length > 0) {
          projectModel.fetchListingDetails(resp).then(
            (result) => {
              if (result.length > 0) {
                projectModel
                  .fetchUserProjectDetails(result, req.body.user_id)
                  .then(
                    (result1) => {
                      if (result1.length > 0) {
                        res.status(successful.ok).send({ data: result1 });
                      } else {
                        res.status(successful.no_content).send({ data: [] });
                      }
                    },
                    (error2) => {
                      console.log(error2);
                      res.status(successful.no_content).send({ data: [] });
                    }
                  );
              } else {
                res.status(successful.no_content).send({ data: [] });
              }
              // res.status(successful.ok).send({ data: result });
            },
            (error1) => {
              console.log(error1);
              res
                .status(server_error.internal_server_error)
                .send({ message: error1 });
            }
          );
        } else {
          res.status(successful.no_content).send({ data: [] });
        }
      },
      (error) => {
        console.log(error);
        res.status(server_error.internal_server_error).send({ message: error });
      }
    );
  },
  declineBid: (req, res) => {
    listingModel.confirmBidDecline(req.body).then(
      (response) => {
        if (response.length > 0) {
          res.status(successful.ok).send({
            message: "Bid already declined or awarded to someone else",
          });
        } else {
          listingModel.declineBid(req.body).then(
            (resp) => {
              if (resp[0] == 1) {
                res
                  .status(successful.ok)
                  .send({ message: "Bid decline successfully" });
              } else {
                res
                  .status(server_error.internal_server_error)
                  .send({ message: "Bid faild to decline" });
              }
            },
            (error) => {
              console.log(error);
              res
                .status(server_error.internal_server_error)
                .send({ message: error });
            }
          );
        }
      },
      (error1) => {
        console.log(error);
        res
          .status(server_error.internal_server_error)
          .send({ message: error1 });
      }
    );
  },
  acceptBid: (req, res) => {
    listingModel.confirmBidAcceptance(req.body).then(
      (response) => {
        if (response.length > 0) {
          res.status(successful.ok).send({
            message: "Bid already accepted or awarded to someone else",
          });
        } else {
          listingModel.acceptBid(req.body).then(
            (resp) => {
              // console.log("Fisrt response >>>>>>>>>>>>>", resp);
              if (resp[0] == 1) {
                listingModel.bidAwarded(req.body).then(
                  (result) => {
                    // console.log("Second response >>>>>>>>>>>>>", result);
                    if (result == null) {
                      res
                        .status(server_error.internal_server_error)
                        .send({ message: "Server error" });
                    } else if (result[0] == 0) {
                      listingModel.addProject(req.body).then((result1) => {
                        if (result1) {
                          res.status(successful.ok).send({
                            message: "Bid accept successully",
                            data: result1.dataValues,
                          });
                        }
                      });
                    } else {
                      listingModel.addProject(req.body).then((result2) => {
                        if (result2) {
                          res.status(successful.ok).send({
                            message: "Bid accept successully",
                            data: result2.dataValues,
                          });
                        }
                      });
                    }
                  },
                  (err) => {
                    console.log(err);
                    res
                      .status(server_error.internal_server_error)
                      .send({ message: err });
                  }
                );
              } else {
                res
                  .status(server_error.internal_server_error)
                  .send({ message: "Bid faild to accept" });
              }
            },
            (error) => {
              console.log(error);
              res
                .status(server_error.internal_server_error)
                .send({ message: error });
            }
          );
        }
      },
      (error1) => {
        console.log(error1);
        res
          .status(server_error.internal_server_error)
          .send({ message: error1 });
      }
    );
  },
};
