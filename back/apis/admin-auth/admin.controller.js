const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { adminModel } = require("./admin.model");
const Utils = require("../../configs/utils");
const config = require("./../../configs/auth");
const Mailer = require("./../../libs/emails/mailchimp");
// const { helpers } = require("../../libs/utilities/helpers");

const { successful, redirection, client_error, server_error } =
  Utils.status_codes;

exports.adminController = {
  registerAdmin: (req, res) => {
    adminModel.checkEmailExistance(req.body).then(
      (resp) => {
        if (resp.length > 0) {
          res
            .status(client_error.not_acceptable)
            .send({ message: "User with this email already exist" });
        } else {
          adminModel.registerAdmin(req.body).then(
            (resp) => {
              if (resp.dataValues) {
                res
                  .status(successful.created)
                  .send({ message: "Succcessful", data: resp.dataValues });
              } else {
                res
                  .status(server_error.internal_server_error)
                  .send({ message: "Failed", data: {} });
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
      (error) => {
        console.log(error);
        res.status(server_error.internal_server_error).send({ message: error });
      }
    );
  },
  loginAdmin: (req, res) => {
    const { password } = req.body;

    adminModel.loginAdmin(req.body).then(
      (resp) => {
        if (resp == null) {
          res
            .status(client_error.not_found)
            .send({ message: "Email does not exist" });
        } else {
          let db_password = resp.dataValues.password;
          bcrypt.compare(password, db_password, (err, isMatch) => {
            if (isMatch) {
              delete resp.dataValues.password;
              let token = jwt.sign({ data: resp.dataValues }, config.secret, {
                expiresIn: config.expireIn,
              });

              res
                .status(successful.ok)
                .send({ message: "Successful", token, data: resp.dataValues });
            } else {
              res
                .status(client_error.not_acceptable)
                .send({ message: "Incorrect password" });
            }
          });
        }
      },
      (error) => {
        console.log(error);
        res.status(server_error.internal_server_error).send({ message: error });
      }
    );
  },
  listAdmins: (req, res) => {
    adminModel.listAdmins().then(
      (resp) => {
        if (resp.length > 0) {
          res.status(successful.ok).send({ message: "Found", data: resp });
        } else {
          res
            .status(successful.no_content)
            .send({ message: "Not Found", data: [] });
        }
      },
      (error) => {
        console.log(error);
        res.status(server_error.internal_server_error).send({ message: error });
      }
    );
  },
  forgotPassword: (req, res) => {
    const { email } = req.body;
    adminModel.checkEmailExistance(req.body).then(
      (resp) => {
        if (resp.length > 0) {
          const minm = 100000;
          const maxm = 999999;
          let v_code = Math.floor(Math.random() * (maxm - minm + 1)) + minm;

          Mailer.sendEmail(
            "email@eskrobytes.com",
            email,
            "Email Verification",
            `<h1>Your verification code is ${v_code}</h1>`
          ).then(
            (result) => {
              if (result[0].status == "sent") {
                adminModel.updateVcode(email, v_code).then(
                  (resp) => {
                    if (resp[0] > 0) {
                      res.status(successful.ok).send({ message: "Successful" });
                    } else {
                      res
                        .status(client_error.bad_request)
                        .send({ message: "Failed" });
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
                res.status(server_error.internal_server_error).send({
                  message: "Message not sent",
                });
              }
            },
            (error) => {
              res.status(server_error.internal_server_error).send({
                message: error,
              });
            }
          );
        } else {
          res
            .status(client_error.not_found)
            .send({ message: "Email does not exist" });
        }
      },
      (error) => {
        console.log(error);
        res.status(server_error.internal_server_error).send({ message: error });
      }
    );
  },
  verifyCode: (req, res) => {
    adminModel.verifyCode(req.body).then(
      (resp) => {
        if (resp.length > 0) {
          res.status(successful.ok).send({ message: "Successful" });
        } else {
          res.status(client_error.not_found).send({ message: "Failed" });
        }
      },
      (error) => {
        console.log(error);
        res.status(server_error.internal_server_error).send({ message: error });
      }
    );
  },
  updatePassword: (req, res) => {
    adminModel.updatePassword(req.body).then(
      (resp) => {
        if (resp[0] == 1) {
          res.status(successful.created).send({ message: "Successful" });
        } else {
          res.status(client_error.not_acceptable).send({ message: "Failed" });
        }
      },
      (error) => {
        console.log(error);
        res.status(server_error.internal_server_error).send({ message: error });
      }
    );
  },
};
