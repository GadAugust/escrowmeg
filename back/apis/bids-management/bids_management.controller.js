const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { bidsManagerModel } = require("./bids_management.model");
const Utils = require("../../configs/utils");
const config = require("./../../configs/auth");
const Mailer = require("./../../libs/emails/mailchimp");
// const { helpers } = require("../../libs/utilities/helpers");

const { successful, redirection, client_error, server_error } =
  Utils.status_codes;

exports.bidsManagerController = {
  fetchBids: (req, res) => {
    bidsManagerModel.fetchBids(req.body).then(
      (resp) => {
        if (resp.length > 0) {
          bidsManagerModel.getListingDetails(resp).then(
            (result) => {
              if (result.length > 0) {
                res.status(successful.ok).send({ data: result });
              } else {
                res.status(successful.no_content).send({ data: [] });
              }
            },
            (error) => {
              console.log(error);
              res
                .status(server_error.internal_server_error)
                .send({ message: error });
            }
          );
          // res.status(successful.ok).send({ data: resp });
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
  getBidDetails: (req, res) => {
    bidsManagerModel.getBidDetails(req.body).then(
      (resp) => {
        if (resp.length > 0) {
          bidsManagerModel.getListingDetails(resp).then(
            (resp) => {
              if (resp.length > 0) {
                res.status(successful.ok).send({ data: resp });
              } else {
                res.status(successful.no_content).send({ data: [] });
              }
            },
            (error) => {
              console.log(error);
              res
                .status(server_error.internal_server_error)
                .send({ message: error });
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
