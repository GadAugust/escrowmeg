const { walletModel } = require("./wallet.model");
const Utils = require("./../../configs/utils");
const config = require("./../../configs/auth");
const transactions = require("../../models/wallet/transactions");

const { successful, redirection, client_error, server_error } =
  Utils.status_codes;

exports.walletController = {
  addMoney: (req, res) => {
    const { user_id, payment_ref, amount, transaction_type } = req.body;
    walletModel.addMoney(req.body).then(
      (resp) => {
        if (resp["response"][0] === 1) {
          walletModel
            .createPaymentReference(
              user_id,
              payment_ref,
              amount,
              transaction_type
            )
            .then(
              (response) => {
                res.status(successful.accepted).send({
                  message: "Payment Successful",
                  data: resp["totalAmount"],
                });
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
            .send({ message: "Payment failed" });
        }
      },
      (error) => {
        res.status(server_error.internal_server_error).send({ message: error });
      }
    );
  },
  transactions: (req, res) => {
    //console.log(req.body)
    walletModel.transactions(req.body).then(
      (resp) => {
        if (resp) {
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
  withdraw: (req, res) => {
    const { user_id, payment_ref, amount, bank_id, transaction_type, pin } =
      req.body;
    walletModel.verifyPin(req.body).then(
      (outcome) => {
        if (outcome.message == "is Match") {
          walletModel.withdraw(req.body).then(
            (resp) => {
              if (resp["response"][0] === 1) {
                walletModel
                  .createPaymentReference(
                    user_id,
                    payment_ref,
                    amount,
                    transaction_type,
                    bank_id
                  )
                  .then(
                    (response) => {
                      if (response) {
                        res.status(successful.accepted).send({
                          message: "Withdrawal Successful",
                          data: resp["totalAmount"],
                        });
                      } else {
                        res
                          .status(server_error.internal_server_error)
                          .send({ message: "Withdrawal failed" });
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
                  .send({ message: "Withdrawal failed" });
              }
            },
            (error) => {
              res
                .status(server_error.internal_server_error)
                .send({ message: error });
            }
          );
        } else {
          res
            .status(client_error.not_acceptable)
            .send({ message: "Incorrect transaction pin" });
        }
      },
      (error1) => {
        res
          .status(server_error.internal_server_error)
          .send({ message: error1 });
      }
    );
  },
};
