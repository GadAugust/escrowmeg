const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { projectsManagerModel } = require("./project_management.model");
const { projectModel } = require("./../project/project.model");
const Utils = require("../../configs/utils");
const config = require("./../../configs/auth");
const Mailer = require("./../../libs/emails/mailchimp");
// const { helpers } = require("../../libs/utilities/helpers");

const { successful, redirection, client_error, server_error } =
  Utils.status_codes;

exports.projectsManagerController = {
  fetchProjects: (req, res) => {
    projectsManagerModel.fetchProjects(req.body).then(
      (resp) => {
        if (resp.length > 0) {
          projectModel.fetchListingDetails(resp).then(
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
  getProjectDetails: (req, res) => {
    projectsManagerModel.getProjectDetails(req.body).then(
      (resp) => {
        if (resp.length > 0) {
          projectsManagerModel.fetchListingDetails(resp).then(
            (result) => {
              if (result.length > 0) {
                projectsManagerModel.fetchBidsDetails(result).then(
                  (response) => {
                    projectsManagerModel.fetchBuyerDetails(response).then(
                      (resp) => {
                        res.status(successful.ok).send({ data: resp });
                      },
                      (error) => {
                        res
                          .status(server_error.internal_server_error)
                          .send({ message: error });
                      }
                    );
                  },
                  (error) => {
                    console.log(error);
                    res
                      .status(server_error.internal_server_error)
                      .send({ message: error });
                  }
                );
              } else {
                res.status(successful.ok).send({ data: resp });
              }
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
};
