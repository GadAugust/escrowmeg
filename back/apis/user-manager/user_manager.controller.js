const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { userManagerModel } = require("./user_manager.model");
const { projectModel } = require("./../project/project.model");
const Utils = require("../../configs/utils");
const config = require("./../../configs/auth");
const Mailer = require("./../../libs/emails/mailchimp");
// const { helpers } = require("../../libs/utilities/helpers");

const { successful, redirection, client_error, server_error } =
  Utils.status_codes;

exports.userManagerController = {
  fetchAdminSummary: (req, res) => {
    userManagerModel.fetchAdminSummary().then(
      (resp) => {
        res.status(successful.ok).send({ data: resp });
      },
      (error) => {
        res.status(server_error.internal_server_error).send({ message: error });
      }
    );
  },

  userDashboard: (req, res) => {
    console.log("Summary data", req.body);
    userManagerModel.userDashboard(req.body).then(
      (resp) => {
        // console.log(resp);
        res.status(successful.ok).send({ data: resp });
      },
      (error) => {
        res.status(server_error.internal_server_error).send({ message: error });
      }
    );
  },
  fetchAllUsers: (req, res) => {
    userManagerModel.fetchAllUser(req.body).then(
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
  searchUser: (req, res) => {
    userManagerModel.searchUsers(req.body.searchWord).then(
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
  fetchUserForEachMonth: (req, res) => {
    userManagerModel.fetchUserForEachMonth(req.body).then(
      (resp) => {
        res.status(successful.ok).send({ data: resp });
      },
      (error) => {
        res.status(server_error.internal_server_error).send({ message: error });
      }
    );
  },
  fetchPayoutForEachMonth: (req, res) => {
    userManagerModel.fetchPayoutForEachMonth(req.body).then(
      (resp) => {
        res.status(successful.ok).send({ data: resp });
      },
      (error) => {
        res.status(server_error.internal_server_error).send({ message: error });
      }
    );
  },
  fetchUserListings: (req, res) => {
    userManagerModel.fetchUserListings(req.body).then(
      (resp) => {
        if (resp.length > 0) {
          res.status(successful.ok).send({ data: resp });
        } else {
          res.status(successful.no_content).send({ data: [] });
        }
      },
      (error) => {
        res.status(server_error.internal_server_error).send({ message: error });
      }
    );
  },
  fetchUserProjects: (req, res) => {
    userManagerModel.fetchUserProjects(req.body).then(
      (resp) => {
        if (resp.length > 0) {
          projectModel.fetchListingDetails(resp).then(
            (result) => {
              if (result.length > 0) {
                userManagerModel
                  .fetchUserDetails(result, req.body.user_id)
                  .then(
                    (response) => {
                      if (response.length > 0) {
                        res.status(successful.ok).send({ data: response });
                      } else {
                        res.status(successful.ok).send({ data: result });
                      }
                    },
                    (erro1) => {
                      console.log(erro1);
                      res
                        .status(server_error.internal_server_error)
                        .send({ message: erro1 });
                    }
                  );
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
        res.status(server_error.internal_server_error).send({ message: error });
      }
    );
  },
  fetchUserBids: (req, res) => {
    userManagerModel.fetchUserBids(req.body).then(
      (resp) => {
        if (resp.length > 0) {
          userManagerModel.fetchUserBidDetails(resp).then(
            (result) => {
              if (result.length > 0) {
                userManagerModel.fetchUserListingDetails(result).then(
                  (response) => {
                    if (response.length > 0) {
                      res.status(successful.ok).send({ data: response });
                    }
                  },
                  (error) => {
                    console.log("Error2 >>>>>>>", error);
                    res
                      .status(server_error.internal_server_error)
                      .send({ message: error });
                  }
                );
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
        res.status(server_error.internal_server_error).send({ message: error });
      }
    );
  },
  PaymentsRequested: (req, res) => {
    userManagerModel.PaymentsRequested(req.body).then(
      (resp) => {
        if (resp.length > 0) {
          userManagerModel.fetchUserPaymentRequestDetails(resp).then(
            (result) => {
              if (result.length > 0) {
                userManagerModel.fetchListingDetailsRequestPayment(result).then(
                  (response) => {
                    if (response.length > 0) {
                      res.status(successful.ok).send({ data: response });
                    } else {
                      res.status(successful.ok).send({ data: result });
                    }
                  },
                  (error2) => {
                    res
                      .status(server_error.internal_server_error)
                      .send({ message: error2 });
                  }
                );
              } else {
                res.status(successful.ok).send({ data: resp });
              }
            },
            (err) => {
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
        res.status(server_error.internal_server_error).send({ message: error });
      }
    );
  },
  PaymentsReleased: (req, res) => {
    userManagerModel.PaymentsReleased(req.body).then(
      (resp) => {
        if (resp.length > 0) {
          userManagerModel
            .fetchUserPaymentReleasedDetails(resp, req.body.user_id)
            .then(
              (result) => {
                if (result.length > 0) {
                  userManagerModel
                    .fetchListingDetailsRequestPayment(result)
                    .then(
                      (response) => {
                        if (response.length > 0) {
                          res.status(successful.ok).send({ data: response });
                        } else {
                          res.status(successful.ok).send({ data: result });
                        }
                      },
                      (error) => {
                        res
                          .status(server_error.internal_server_error)
                          .send({ message: error });
                      }
                    );
                } else {
                  res.status(successful.no_content).send({ data: [] });
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
          res.status(successful.no_content).message({ data: [] });
        }
        // res.status(successful.ok).send({ data: resp });
      },
      (error) => {
        res.status(server_error.internal_server_error).send({ message: error });
      }
    );
  },
};
