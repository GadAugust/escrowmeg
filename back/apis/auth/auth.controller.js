const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { authModel } = require("./auth.model");
const Utils = require("../../configs/utils");
const config = require("./../../configs/auth");
const Mailer = require("./../../libs/emails/mailchimp");
// const { helpers } = require("../../libs/utilities/helpers");

const { successful, redirection, client_error, server_error } =
  Utils.status_codes;

exports.authController = {
  verifyEmail: (req, res) => {
    const { email } = req.body;
    authModel.twoWayEmailVerification(email).then(
      (resp) => {
        if (resp.emailTableCount >= 1 && resp.userTableCount >= 1) {
          res.status(client_error.not_acceptable).send({
            message: "User with this email address already exists",
            data: null,
          });
        } else {
          const minm = 100000;
          const maxm = 999999;
          let v_code = Math.floor(Math.random() * (maxm - minm + 1)) + minm;

          /*Mailer.sendEmail(
            "email@eskrobytes.com",
            email,
            "Email Verification",
            `<div  style="font-family: Arial, sans-serif; line-height: 1.6; background-color: #f6f6f6; margin: 0; padding: 0;">
              <table cellpadding="0" cellspacing="0" width="100%" style="background-color: #f6f6f6; padding: 20px;">
                <tr>
                  <td align="center">
                    <table cellpadding="0" cellspacing="0" width="400" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                      <tr>
                        <td align="center">
                        <div style="background-color: blue; border-top-left-radius: 8px; border-top-right-radius: 8px; color: #f6f6f6; padding: 1px;"><h3>Email Verification</h3></div>
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style="padding: 20px;">
                          <img src="https://eskro-bucket.ams3.cdn.digitaloceanspaces.com/assets/e_logo.png" style="max-width: 150px; max-height: auto;" alt="" srcset="">
                        </td>
                      </tr>
            
                      <!-- User Information -->
                      <tr>
                        <td style="padding: 20px;">
                          <p>Hi,</p>
                          <h3>Your email verification code is ${v_code}</h3>
                          <p style="font-size: 14px;">If you have any questions or need further assistance, please don't hesitate to contact us.</p>
                          <p style="font-size: 14px;">Best regards,<br>
                            Eskrobytes team
                          </p>
                        </td>
                      </tr>
            
                      <!-- Footer -->
                      <tr>
                        <td align="center" style="background-color: #f6f6f6; padding: 10px; border-top: 1px solid #dddddd;">
                          <p style="color: #999999; font-size: 12px;">
                            Your Organization Name<br>
                            Address Line 1<br>
                            Address Line 2<br>
                            Phone: (123) 456-7890<br>
                            Email: email@eskrobytes.com
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </div>`
          ).then(
            (result) => {*/
              //if (result[0].status == "sent") {
                authModel.emailConfirmation(email, v_code).then((resp) => {
                  if (resp) {
                    res.status(successful.ok).send({
                      message: "Verification Successful",
                    });
                  } else {
                    res.status(server_error.internal_server_error).send({
                      message: "Error occured",
                    });
                  }
                });
              //} else {
                //res.status(client_error.not_acceptable).send({
                //  message: "Email format not allowed",
                //});
              //}
            /*},
            (error) => {
              res.status(server_error.internal_server_error).send({
                message: error,
              });
            }
          );*/
        }
      },
      (error) => {
        console.log(error);
        res.status(server_error.internal_server_error).send({ message: error });
      }
    );
  },
  verifyCode: (req, res) => {
    console.log(req.body);
    authModel.verifyCode(req.body).then(
      (resp) => {
        if (resp == null) {
          res.status(successful.ok).send({
            status: client_error.not_found,
            message: "Verification code not matched",
            data: {},
          });
        } else {
          res.status(successful.ok).send({
            status: successful.ok,
            message: "Verification code matched",
            data: resp.dataValues,
          });
        }
      },
      (error) => {
        console.log(error);
        res.status(server_error.internal_server_error).send({ message: error });
      }
    );
  },
  register: (req, res) => {
    const { email } = req.body;
    const admin_email = "email@eskrobytes.com";
    authModel.register(req.body).then(
      (resp) => {
       /* Mailer.sendEmail(
          admin_email,
          email,
          "Registration completed",
          `<div  style="font-family: Arial, sans-serif; line-height: 1.6; background-color: #f6f6f6; margin: 0; padding: 0;">
            <table cellpadding="0" cellspacing="0" width="100%" style="background-color: #f6f6f6; padding: 20px;">
              <tr>
                <td align="center">
                  <table cellpadding="0" cellspacing="0" width="400" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                    <tr>
                      <td align="center">
                      <div style="background-color: blue; border-top-left-radius: 8px; border-top-right-radius: 8px; color: #f6f6f6; padding: 1px;"><h3>Complete Registration</h3></div>
                      </td>
                    </tr>
        
                    <tr>
                      <td align="center" style="padding: 20px;">
                        <img src="https://eskro-bucket.ams3.cdn.digitaloceanspaces.com/assets/e_logo.png" style="max-width: 150px; max-height: auto;" alt="" srcset="">
                      </td>
                    </tr>
          
                    <!-- User Information -->
                    <tr>
                      <td style="padding: 20px;">
                        <p>Hi,</p>
                        <h3>Thank you for completing the registration process. We are excited to welcome you to our community.</h3>
                        <p style="font-size: 14px;">If you have any questions or need further assistance, please don't hesitate to contact us.</p>
                        <p style="font-size: 14px;">Best regards,<br>
                          Eskrobytes team
                        </p>
                      </td>
                    </tr>
          
                    <!-- Footer -->
                    <tr>
                      <td align="center" style="background-color: #f6f6f6; padding: 10px; border-top: 1px solid #dddddd;">
                        <p style="color: #999999; font-size: 12px;">
                          Your Organization Name<br>
                          Address Line 1<br>
                          Address Line 2<br>
                          Phone: (123) 456-7890<br>
                          Email: ${admin_email}
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </div>`
        ).then(
          (result) => {
            if (result[0].status == "sent") {*/
              res.status(successful.accepted).send({
                status: successful.accepted,
                message: "Registration successfully",
                data: resp.dataValues,
              });
            /* } else {
              res.status(server_error.internal_server_error).send({
                message: "Email format not allowed",
              });
            }
          },
          (error) => {
            res.status(server_error.internal_server_error).send({
              status: server_error.internal_server_error,
              message: error,
            });
          }
        );*/
      },
      (error) => {
        console.log(error);
        res.status(server_error.internal_server_error).send({ message: error });
      }
    );
  },
  login: (req, res) => {
    const loginCredential = req.body;
    const { password } = req.body;

    authModel.login(loginCredential).then(
      (resp) => {
        // console.log("Resp >>>>>>>>", resp.dataValues);
        if (resp == null) {
          res.status(successful.ok).send({
            status: client_error.not_found,
            message: "Incorrect Login Credentials",
          });
        } else {
          let db_password = resp.dataValues.password;
          bcrypt.compare(password, db_password, (err, isMatch) => {
            if (isMatch) {
              delete resp.dataValues["password"];
              let token = jwt.sign({ data: resp.dataValues }, config.secret, {
                expiresIn: config.expireIn,
              });
              res.status(successful.ok).send({
                status: successful.accepted,
                message: "Login successfully",
                token,
                data: resp.dataValues,
              });
            } else {
              res.status(successful.ok).send({
                status: client_error.not_found,
                message: "Incorrect Login Details",
              });
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

  forgotPassword: (req, res) => {
    const { email } = req.body;
    authModel.forgotPassword(req.body).then(
      (resp) => {
        if (resp.length > 0) {
          const minm = 100000;
          const maxm = 999999;
          let v_code = Math.floor(Math.random() * (maxm - minm + 1)) + minm;

          Mailer.sendEmail(
            "email@eskrobytes.com",
            email,
            "Email Verification",
            `<div  style="font-family: Arial, sans-serif; line-height: 1.6; background-color: #f6f6f6; margin: 0; padding: 0;">
              <table cellpadding="0" cellspacing="0" width="100%" style="background-color: #f6f6f6; padding: 20px;">
                <tr>
                  <td align="center">
                    <table cellpadding="0" cellspacing="0" width="400" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                      <tr>
                        <td align="center">
                        <div style="background-color: blue; border-top-left-radius: 8px; border-top-right-radius: 8px; color: #f6f6f6; padding: 1px;"><h3>Email Verification</h3></div>
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style="padding: 20px;">
                          <img src="https://eskro-bucket.ams3.cdn.digitaloceanspaces.com/assets/e_logo.png" style="max-width: 150px; max-height: auto;" alt="" srcset="">
                        </td>
                      </tr>
            
                      <!-- User Information -->
                      <tr>
                        <td style="padding: 20px;">
                          <p>Hi,</p>
                          <h3>Your email verification code is ${v_code}</h3>
                          <p style="font-size: 14px;">If you have any questions or need further assistance, please don't hesitate to contact us.</p>
                          <p style="font-size: 14px;">Best regards,<br>
                            Eskrobytes team
                          </p>
                        </td>
                      </tr>
            
                      <!-- Footer -->
                      <tr>
                        <td align="center" style="background-color: #f6f6f6; padding: 10px; border-top: 1px solid #dddddd;">
                          <p style="color: #999999; font-size: 12px;">
                            Your Organization Name<br>
                            Address Line 1<br>
                            Address Line 2<br>
                            Phone: (123) 456-7890<br>
                            Email: email@eskrobytes.com
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </div>`
          ).then(
            (result) => {
              if (result[0].status == "sent") {
                authModel.emailConfirmation(email, v_code).then((resp) => {
                  if (resp[0] == 1) {
                    res.status(successful.ok).send({
                      status: successful.ok,
                      message: "Verification Successful",
                    });
                  }
                });
              } else {
                res.status(server_error.internal_server_error).send({
                  message: "Message not sent",
                });
              }
            },
            (error) => {
              res.status(server_error.internal_server_error).send({
                status: server_error.internal_server_error,
                message: error,
              });
            }
          );
        } else {
          res.status(client_error.not_acceptable).send({
            status: client_error.not_acceptable,
            message: "User with this email address does not exists",
          });
        }
      },
      (error) => {
        console.log(error);
        res.status(server_error.internal_server_error).send({ message: error });
      }
    );
  },
  updatePassword: (req, res) => {
    let { email, password } = req.body;

    authModel.updatePassword(password, email).then((resp) => {
      if (resp[0] === 1) {
        res
          .status(successful.ok)
          .send({ status: successful.created, message: "Successful" });
      } else {
        res.status(successful.ok).send({
          status: server_error.not_implemented,
          message: "Not Successful",
        });
      }
    });
  },
  addAccountDetails: (req, res) => {
    authModel.addAccountDetails(req.body).then(
      (resp) => {
        if (resp.message == "Found") {
          res.status(client_error.not_acceptable).send({
            status: client_error.not_acceptable,
            message: "User with this account number already exists",
          });
        } else {
          res
            .status(successful.accepted)
            .send({ message: "Account registration Successful" });
        }
      },
      (error) => {
        console.log(error);
        res.status(server_error.internal_server_error).send({ message: error });
      }
    );
  },
  fetchAccounts: (req, res) => {
    authModel.fetchAccounts(req.body).then(
      (resp) => {
        if (resp.length > 0) {
          res
            .status(successful.ok)
            .send({ message: "Accounts found", data: resp });
        } else {
          res
            .status(successful.no_content)
            .send({ message: "Accounts not found", data: [] });
        }
      },
      (error) => {
        console.log(error);
        res.status(server_error.internal_server_error).send({ message: error });
      }
    );
  },
  updateAccountDetails: (req, res) => {
    authModel.updateAccountDetails(req.body).then(
      (resp) => {
        console.log(resp);
      },
      (error) => {
        console.log(error);
        res.status(server_error.internal_server_error).send({ message: error });
      }
    );
  },
  addProfilePics: (req, res) => {
    console.log("Profile pic", req.body);
    delete req.body.name;
    authModel.addProfilePics(req.body).then(
      (resp) => {
        if (resp.dataValues) {
          res.status(successful.created).send({
            status: successful.created,
            message: "Image uploaded successfully",
            data: resp.dataValues,
          });
        } else {
          res.status(server_error.internal_server_error).send({
            status: server_error.internal_server_error,
            message: "Image failed to upload",
          });
        }
      },
      (error) => {
        res
          .status(server_error.internal_server_error)
          .send({ status: server_error.internal_server_error, message: error });
      }
    );
  },
  addTransactionPin: (req, res) => {
    console.log("Transaction Pin >>>>>>>>>>", req.body);
    authModel.addTransactionPin(req.body).then(
      (resp) => {
        if (resp[0] === 1) {
          res.status(successful.created).send({
            status: successful.created,
            message: "Transaction pin add successfully",
          });
        } else {
          res.status(server_error.internal_server_error).send({
            status: server_error.internal_server_error,
            message: "Transaction pin failed",
          });
        }
      },
      (error) => {
        res
          .status(server_error.internal_server_error)
          .send({ status: server_error.internal_server_error, message: error });
      }
    );
  },
};
