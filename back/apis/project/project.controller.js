const { projectModel } = require("./project.model");
const { walletModel } = require("../../apis/wallet/wallet.model");
const Utils = require("../../configs/utils");
const config = require("../../configs/auth");
const transactions = require("../../models/wallet/transactions");
const uuid4 = require("uuid4");

const { successful, redirection, client_error, server_error } =
  Utils.status_codes;

exports.projectController = {
  getOngoingProject: (req, res) => {
    projectModel.fetchOngoingProject(req.body).then(
      (resp) => {
        if (resp.length == 0) {
          res
            .status(successful.no_content)
            .send({ message: "No record Found" });
        } else {
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
        }
      },
      (errors) => {
        console.log(errors);
        res
          .status(server_error.internal_server_error)
          .send({ message: errors });
      }
    );
  },
  getCompleteProject: (req, res) => {
    projectModel.fetchOngoingProject(req.body).then(
      (resp) => {
        if (resp.length == 0) {
          res
            .status(successful.no_content)
            .send({ message: "No record Found" });
        } else {
          projectModel.fetchListingDetails(resp).then((result) => {
            // console.log("Array finished projects", result);
            res.status(successful.ok).send({ data: result });
          });
        }
      },
      (errors) => {
        console.log(errors);
        res
          .status(server_error.internal_server_error)
          .send({ message: errors });
      }
    );
  },
  raiseDispute: (req, res) => {
    console.log("Raise dispute", req.body);
    delete req.body.name;
    projectModel.raiseDispute(req.body).then(
      (resp) => {
        if (resp.dataValues) {
          projectModel.getUserDetails(resp.dataValues).then(
            (result) => {
              if (result.dataValues) {
                let finalData = {
                  ...resp.dataValues,
                  user: result.dataValues,
                };
                console.log("Final data", finalData);
                res
                  .status(successful.created)
                  .send({ data: finalData, message: "Dispute raised" });
              } else {
                res
                  .status(successful.no_content)
                  .send({ data: {}, message: "Dispute failed" });
              }
            },
            (err) => {
              res
                .status(server_error.internal_server_error)
                .send({ message: err });
            }
          );
        } else {
          res
            .status(successful.no_content)
            .send({ data: {}, message: "Dispute failed" });
        }
      },
      (error) => {
        console.log(error);
        res.status(server_error.internal_server_error).send({ message: error });
      }
    );
  },
  requestPayment: (req, res) => {
    let amount = parseInt(req.body.amount);
    let agreed_price = parseInt(req.body.agreed_price);

    projectModel.getPreviousPayments(req.body).then(
      (resp) => {
        let payments = resp;
        if (resp.length > 0) {
          // console.log("IF BLOCK");
          let prevPayments = 0;
          let totalBalance = 0;

          for (const payment of payments) {
            prevPayments += parseInt(payment.dataValues.amount);
          }

          totalBalance = prevPayments + parseInt(amount);

          if (totalBalance > agreed_price) {
            res.status(successful.ok).send({
              message: "Payment requests is more than the agreed price",
            });
          } else {
            projectModel.requestPayment(req.body).then(
              (result1) => {
                if (result1.dataValues) {
                  res
                    .status(successful.created)
                    .send({ message: "Request payment successful" });
                } else {
                  res
                    .status(server_error.internal_server_error)
                    .send({ message: "Request payment failed" });
                }
              },
              (error1) => {
                console.log(error1);
                res
                  .status(server_error.internal_server_error)
                  .send({ message: error1 });
              }
            );
          }
        } else {
          // console.log("ELSE BLOCK >>>>>>>>>>>>>>>>>");
          if (amount > agreed_price) {
            res.status(client_error.not_acceptable).send({
              message: "Payment requests is more than the agreed price",
            });
          } else {
            // console.log("ELSE ELSE BLOCK >>>>>>>>>>>>");
            projectModel.getPreviousPayments(req.body).then(
              (prevPayment) => {
                if (prevPayment.length > 0) {
                  let payments = prevPayment;
                  let prevPayments = 0;
                  let totalBalance = 0;

                  for (const payment of payments) {
                    prevPayments += parseInt(payment.dataValues.amount);
                  }
                  totalBalance = prevPayments + parseInt(amount);

                  if (totalBalance > agreed_price) {
                    res.status(successful.ok).send({
                      message: "Payment requests is more than the agreed price",
                    });
                  } else {
                    projectModel.requestPayment(req.body).then(
                      (result1) => {
                        if (result1.dataValues) {
                          res
                            .status(successful.created)
                            .send({ message: "Request payment successful" });
                        } else {
                          res
                            .status(server_error.internal_server_error)
                            .send({ message: "Request payment failed" });
                        }
                      },
                      (error1) => {
                        console.log(error1);
                        res
                          .status(server_error.internal_server_error)
                          .send({ message: error1 });
                      }
                    );
                  }
                } else {
                  projectModel.requestPayment(req.body).then(
                    (result2) => {
                      if (result2.dataValues) {
                        res
                          .status(successful.created)
                          .send({ message: "Request payment successful" });
                      } else {
                        res
                          .status(server_error.internal_server_error)
                          .send({ message: "Request payment failed" });
                      }
                    },
                    (error2) => {
                      console.log(error2);
                      res
                        .status(server_error.internal_server_error)
                        .send({ message: error2 });
                    }
                  );
                }
              },
              (error3) => {
                res
                  .status(server_error.internal_server_error)
                  .send({ message: error3 });
              }
            );
          }
        }
      },
      (error) => {
        console.log(error);
        res.status(server_error.internal_server_error).send({ message: error });
      }
    );
  },
  requestPaymentHistory: (req, res) => {
    projectModel.requestPaymentHistory(req.body).then(
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
  sendMessage: (req, res) => {
    projectModel.sendMessage(req.body).then(
      (resp) => {
        if (resp.dataValues) {
          res.status(successful.created).send({
            message: "Message sent successfully",
            data: resp.dataValues,
          });
        } else {
          res
            .status(successful.no_content)
            .send({ message: "Message failed to send" });
        }
      },
      (error) => {
        console.log(error);
        res.status(server_error.internal_server_error).send({ message: error });
      }
    );
  },
  fetchMessages: (req, res) => {
    console.log("Messages Params", req.body);
    projectModel.fetchMessages(req.body).then(
      (resp) => {
        if (resp.length > 0) {
          res.status(successful.ok).send({ data: resp });
        } else {
          res.status(successful.no_content).send({ data: [] });
        }
      },
      (error) => {
        console.log(error);
        res.status(server_error).send({ message: error });
      }
    );
  },
  fetchDisputes: (req, res) => {
    console.log(req.body);
    projectModel.fetchDisputes(req.body).then(
      (resp) => {
        if (resp.length > 0) {
          res.status(successful.ok).send({ data: resp });
        } else {
          res.status(successful.no_content).send({ data: [] });
        }
      },
      (error) => {
        console.log(error);
        res.status(server_error).send({ message: error });
      }
    );
  },
  declineRequestPayment: (req, res) => {
    walletModel.verifyPin(req.body).then(
      (resp) => {
        if (resp.message == "is Match") {
          projectModel.declineRequestPayment(req.body).then(
            (resp) => {
              if (resp[0] == 1) {
                projectModel.requestPaymentHistory(req.body).then(
                  (paymentHistory) => {
                    if (paymentHistory.length > 0) {
                      res
                        .status(successful.accepted)
                        .send({ message: "Successful", data: paymentHistory });
                    }
                  },
                  (error) => {
                    res
                      .status(server_error.internal_server_error)
                      .send({ message: error });
                  }
                );
              } else {
                res.status(successful.no_content).send({ message: "Failed" });
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
          res.status(client_error.forbidden).send({ message: "Incorrect Pin" });
        }
      },
      (error) => {
        console.log(error);
        res.status(server_error.internal_server_error).send({ message: error });
      }
    );
  },
  acceptRequestPayment: (req, res) => {
    let amount = parseFloat(req.body.amount);
    let agreed_price = parseFloat(req.body.agreed_price);
    let wallet = 0;
    let newWalletBalance = 0;

    walletModel.verifyPin(req.body).then(
      (resp) => {
        if (resp.message == "is Match") {
          projectModel.checkBalance(req.body).then(
            (resp) => {
              if (resp[0].dataValues.wallet < req.body.amount) {
                res
                  .status(client_error.payment_required)
                  .send({ message: "Your balance is low" });
              } else {
                wallet = parseFloat(resp[0].dataValues.wallet);
                projectModel.getAcceptedReleasedPreviousPayments(req.body).then(
                  (resp) => {
                    let payments = resp;
                    if (resp.length > 0) {
                      let prevPayments = 0;
                      let totalBalance = 0;

                      for (const payment of payments) {
                        prevPayments += parseFloat(payment.dataValues.amount);
                      }

                      totalBalance = prevPayments + parseFloat(amount);
                      if (totalBalance > agreed_price) {
                        res.status(client_error.forbidden).send({
                          message:
                            "Payment requests is more than the agreed price",
                        });
                      } else {
                        newWalletBalance = parseFloat(wallet - amount);
                        projectModel
                          .updateUserBalance(req.body.user_id, newWalletBalance)
                          .then(
                            (resp) => {
                              if (resp[0] == 1) {
                                projectModel.getEskroBalance().then(
                                  (resp) => {
                                    let eskroBalance = resp.dataValues.value;
                                    let newEskroBalance = parseFloat(
                                      eskroBalance + amount
                                    );
                                    projectModel
                                      .updateEskroBalance(newEskroBalance)
                                      .then(
                                        (resp) => {
                                          if (resp[0] == 1) {
                                            projectModel
                                              .acceptRequestPayment(req.body)
                                              .then(
                                                (resp) => {
                                                  if (resp[0] == 1) {
                                                    const minm = 100000000;
                                                    const maxm = 999999999;
                                                    let v_code =
                                                      Math.floor(
                                                        Math.random() *
                                                          (maxm - minm + 1)
                                                      ) + minm;
                                                    let payment_ref = `paid-${v_code}-${req.body.user_id}`;
                                                    let transaction_type =
                                                      "debit";
                                                    walletModel
                                                      .createPaymentReference(
                                                        req.body.user_id,
                                                        payment_ref,
                                                        req.body.amount,
                                                        transaction_type
                                                      )
                                                      .then(
                                                        (resp) => {
                                                          if (resp.dataValues) {
                                                            projectModel
                                                              .requestPaymentHistory(
                                                                req.body
                                                              )
                                                              .then(
                                                                (resp) => {
                                                                  res
                                                                    .status(
                                                                      successful.created
                                                                    )
                                                                    .send({
                                                                      message:
                                                                        "Successful",
                                                                      data: resp,
                                                                      balance:
                                                                        newWalletBalance,
                                                                    });
                                                                },
                                                                (error) => {
                                                                  console.log(
                                                                    error
                                                                  );
                                                                  res
                                                                    .status(
                                                                      server_error.internal_server_error
                                                                    )
                                                                    .send({
                                                                      message:
                                                                        error,
                                                                    });
                                                                }
                                                              );
                                                          } else {
                                                            res
                                                              .status(
                                                                successful.no_content
                                                              )
                                                              .send({
                                                                message:
                                                                  "No content",
                                                              });
                                                          }
                                                        },
                                                        (error) => {
                                                          console.log(error);
                                                          res
                                                            .status(
                                                              server_error.internal_server_error
                                                            )
                                                            .send({
                                                              message: error,
                                                            });
                                                        }
                                                      );
                                                  } else {
                                                    res
                                                      .status(
                                                        server_error.internal_server_error
                                                      )
                                                      .send({
                                                        message: "Server error",
                                                      });
                                                  }
                                                },
                                                (error) => {
                                                  console.log(error);
                                                  res
                                                    .status(
                                                      server_error.internal_server_error
                                                    )
                                                    .send({ message: error });
                                                }
                                              );
                                          } else {
                                            res
                                              .status(
                                                server_error.internal_server_error
                                              )
                                              .send({
                                                message: "Server error",
                                              });
                                          }
                                        },
                                        (error) => {
                                          console.log(error);
                                          res
                                            .status(
                                              server_error.internal_server_error
                                            )
                                            .send({ message: error });
                                        }
                                      );
                                  },
                                  (error) => {
                                    console.log(error);
                                    res
                                      .status(
                                        server_error.internal_server_error
                                      )
                                      .send({ message: error });
                                  }
                                );
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
                      }
                    } else {
                      newWalletBalance = parseFloat(wallet - amount);
                      projectModel
                        .updateUserBalance(req.body.user_id, newWalletBalance)
                        .then(
                          (resp) => {
                            if (resp[0] == 1) {
                              projectModel.getEskroBalance().then(
                                (resp) => {
                                  let eskroBalance = resp.dataValues.value;
                                  let newEskroBalance = parseFloat(
                                    eskroBalance + amount
                                  );
                                  projectModel
                                    .updateEskroBalance(newEskroBalance)
                                    .then(
                                      (resp) => {
                                        if (resp[0] == 1) {
                                          projectModel
                                            .acceptRequestPayment(req.body)
                                            .then(
                                              (resp) => {
                                                if (resp[0] == 1) {
                                                  const minm = 100000000;
                                                  const maxm = 999999999;
                                                  let v_code =
                                                    Math.floor(
                                                      Math.random() *
                                                        (maxm - minm + 1)
                                                    ) + minm;
                                                  let payment_ref = `paid-${v_code}-${req.body.user_id}`;
                                                  let transaction_type =
                                                    "debit";
                                                  walletModel
                                                    .createPaymentReference(
                                                      req.body.user_id,
                                                      payment_ref,
                                                      req.body.amount,
                                                      transaction_type
                                                    )
                                                    .then(
                                                      (resp) => {
                                                        if (resp.dataValues) {
                                                          projectModel
                                                            .requestPaymentHistory(
                                                              req.body
                                                            )
                                                            .then(
                                                              (resp) => {
                                                                res
                                                                  .status(
                                                                    successful.created
                                                                  )
                                                                  .send({
                                                                    message:
                                                                      "Successful",
                                                                    data: resp,
                                                                    balance:
                                                                      newWalletBalance,
                                                                  });
                                                              },
                                                              (error) => {
                                                                console.log(
                                                                  error
                                                                );
                                                                res
                                                                  .status(
                                                                    server_error.internal_server_error
                                                                  )
                                                                  .send({
                                                                    message:
                                                                      error,
                                                                  });
                                                              }
                                                            );
                                                        } else {
                                                          res
                                                            .status(
                                                              successful.no_content
                                                            )
                                                            .send({
                                                              message:
                                                                "No content",
                                                            });
                                                        }
                                                      },
                                                      (error) => {
                                                        console.log(error);
                                                        res
                                                          .status(
                                                            server_error.internal_server_error
                                                          )
                                                          .send({
                                                            message: error,
                                                          });
                                                      }
                                                    );
                                                } else {
                                                  res
                                                    .status(
                                                      server_error.internal_server_error
                                                    )
                                                    .send({
                                                      message: "Server error",
                                                    });
                                                }
                                              },
                                              (error) => {
                                                console.log(error);
                                                res
                                                  .status(
                                                    server_error.internal_server_error
                                                  )
                                                  .send({ message: error });
                                              }
                                            );
                                        } else {
                                          res
                                            .status(
                                              server_error.internal_server_error
                                            )
                                            .send({ message: "Server error" });
                                        }
                                      },
                                      (error) => {
                                        console.log(error);
                                        res
                                          .status(
                                            server_error.internal_server_error
                                          )
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
              res
                .status(server_error.internal_server_error)
                .send({ message: error });
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
  releaseFund: (req, res) => {
    let amount = parseFloat(req.body.amount);
    let percentageCharges = 0;
    let newEskroBalance = 0;

    walletModel.verifyPin(req.body).then(
      (resp) => {
        if (resp.message == "is Match") {
          projectModel.getChargesWithBalance().then(
            (resp) => {
              if (resp.length > 0) {
                percentageCharges = parseFloat(resp[1].dataValues.value);
                let eskroCharges = parseFloat(
                  (percentageCharges / 100) * amount
                );
                let amountAfterCharges = parseFloat(amount - eskroCharges);
                newEskroBalance = parseFloat(
                  resp[0].dataValues.value - amountAfterCharges
                );
                projectModel.updateEskroBalance(newEskroBalance).then(
                  (resp) => {
                    if (resp[0] == 1) {
                      req.body.amount = amountAfterCharges;
                      walletModel
                        .addMoney({
                          user_id: req.body.seller_id,
                          amount: amountAfterCharges,
                        })
                        .then(
                          (resp) => {
                            if (resp.response && resp.totalAmount) {
                              projectModel.releaseFund(req.body).then(
                                (resp) => {
                                  if (resp[0] == 1) {
                                    projectModel
                                      .getRequestPaymentDetailsAfterRelease(
                                        req.body.request_payment_id
                                      )
                                      .then(
                                        (resp) => {
                                          if (
                                            resp.length > 0 ||
                                            resp[0].dataValues
                                          ) {
                                            res.status(successful.ok).send({
                                              message: "Successful",
                                              data: resp[0].dataValues,
                                              amountAfterChargesDeduction:
                                                amountAfterCharges,
                                            });
                                          } else {
                                            res
                                              .status(
                                                server_error.internal_server_error
                                              )
                                              .send({
                                                message: "Failed",
                                                data: {},
                                              });
                                          }
                                        },
                                        (error) => {
                                          console.log(error);
                                          res
                                            .status(
                                              server_error.internal_server_error
                                            )
                                            .send({ message: error });
                                        }
                                      );
                                  } else {
                                    res
                                      .status(successful.no_content)
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
                        .status(successful.no_content)
                        .send({ message: "Not found" });
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
                  .status(successful.no_content)
                  .send({ message: "Not Found" });
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
            .send({ message: "Incorrect Pin" });
        }
      },
      (error) => {
        console.log(error);
        res.status(server_error.internal_server_error).send({ message: error });
      }
    );
  },
  createSettings: (req, res) => {
    projectModel.createSettings(req.body).then(
      (resp) => {
        if (resp.dataValues) {
          res
            .status(successful.created)
            .send({ message: "Settings created successfully" });
        } else {
          res
            .status(successful.no_content)
            .send({ message: "Failed to create settings" });
        }
      },
      (error) => {
        console.log(error);
        res.status(server_error.internal_server_error).send({ message: error });
      }
    );
  },
};
