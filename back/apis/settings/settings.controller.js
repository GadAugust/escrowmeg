const { settingsModel } = require("./settings.model");
const { walletModel } = require("../../apis/wallet/wallet.model");
const { authModel } = require("./../auth/auth.model");
const Utils = require("../../configs/utils");
const config = require("../../configs/auth");

const { successful, redirection, client_error, server_error } =
  Utils.status_codes;

exports.settingsController = {
  changePassword: (req, res) => {
    settingsModel.verifyPassword(req.body).then(
      (resp) => {
        if (resp.message == "is Match") {
          settingsModel.changePassword(req.body).then(
            (resp) => {
              if (resp[0] == 1) {
                res.status(successful.created).send({ message: "Succussful" });
              } else {
                res
                  .status(server_error.internal_server_error)
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
          res
            .status(client_error.not_acceptable)
            .send({ message: "Password not match" });
        }
      },
      (error) => {
        console.log(error);
        res.status(server_error.internal_server_error).send({ message: error });
      }
    );
  },
  changePin: (req, res) => {
    walletModel.verifyPin(req.body).then(
      (resp) => {
        if (resp.message == "is Match") {
          settingsModel.changePin(req.body).then(
            (resp) => {
              if (resp[0] == 1) {
                res.status(successful.created).send({ message: "Successufl" });
              } else {
                res
                  .status(server_error.internal_server_error)
                  .send({ message: "Failed" });
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
            .status(client_error.not_acceptable)
            .send({ message: "Incorrect Pin" });
        }
      },
      (error) => {
        console.log(error);
        res.status(server_error.internal_server_error).send({ message: error });
      }
    );
  },
  forgotPin: (req, res) => {
    const { email } = req.body;
    settingsModel.forgotPin(req.body).then(
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
  updatePin: (req, res) => {
    let { user_id, pin } = req.body;

    settingsModel.updatePin(pin, user_id).then((resp) => {
      if (resp[0] === 1) {
        res.status(successful.ok).send({ message: "Successful" });
      } else {
        res.status(successful.ok).send({
          status: server_error.not_implemented,
          message: "Not Successful",
        });
      }
    });
  },
};
