const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { listingsManagerModel } = require("./listing_management.model");
const { listingModel } = require("./../listing/listing.model");
const Utils = require("../../configs/utils");
const config = require("./../../configs/auth");
const Mailer = require("./../../libs/emails/mailchimp");
// const { helpers } = require("../../libs/utilities/helpers");

const { successful, redirection, client_error, server_error } =
  Utils.status_codes;

exports.listingsManagerController = {
  fetchListings: (req, res) => {
    listingsManagerModel.fetchListings(req.body).then(
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
  searchListing: (req, res) => {
    listingsManagerModel.searchListings(req.body.searchWord).then(
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
  getListingsDetails: (req, res) => {
    listingsManagerModel.getListingDetails(req.body).then(
      (resp) => {
        if (resp.length > 0) {
          listingModel.getEachListingDetails(resp).then(
            (result) => {
              if (result.length > 0) {
                res.status(successful.ok).send({ data: result });
              } else {
                res.status(successful.ok).send({ data: resp });
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
          res.status(successful.no_content).send({ data: [] });
        }
      },
      (error) => {
        console.log(error);
        res.status(server_error.internal_server_error).send({ message: error });
      }
    );
  },
};
