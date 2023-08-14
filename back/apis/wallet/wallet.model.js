const Sequelize = require("sequelize");
const sequelize = require("../../configs/connection");
const transactions = require("../../models/wallet/transactions");
const Op = Sequelize.Op;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const Users = require("./../../models/auth/users")(sequelize, Sequelize);
const PaymentReference = require("./../../models/wallet/payment-reference")(
  sequelize,
  Sequelize
);

// Users.sync({ alter: true });
// PaymentReference.sync({ alter: true });

exports.walletModel = {
  addMoney: (paymentData) => {
    const { user_id: id, amount } = paymentData;
    return new Promise((resolve, reject) => {
      Users.findAll({
        where: {
          id,
        },
      }).then(
        (result) => {
          if (result && result.length > 0) {
            let userData = result[0]["dataValues"];
            let currentAmount = parseFloat(amount);
            let balance = parseFloat(userData["wallet"]);
            let totalAmount = parseFloat(currentAmount + balance);

            Users.update(
              { wallet: totalAmount },
              {
                where: {
                  id,
                },
              }
            ).then(
              (response) => {
                resolve({ response, totalAmount });
              },
              (err) => {
                reject({ err });
              }
            );
          }
        },
        (error) => {
          reject({ error });
        }
      );
    });
  },
  createPaymentReference: (
    user_id,
    payment_reference,
    amount,
    transaction_type,
    bank_id
  ) => {
    const prData = {
      user_id,
      payment_reference,
      amount,
      transaction_type,
      bank_id,
    };
    return new Promise((resolve, reject) => {
      PaymentReference.create(prData).then(
        (payRefData) => {
          resolve(payRefData);
        },
        (error) => {
          reject({ error });
        }
      );
    });
  },
  transactions: (userData) => {
    const { user_id } = userData;
    return new Promise((resolve, reject) => {
      PaymentReference.findAll({
        where: {
          user_id,
        },
        order: [["id", "DESC"]],
      }).then(
        async (result) => {
          const balance = await Users.findOne({
            where: { id: user_id },
            attributes: ["wallet"],
          });
          console.log(balance);
          result = { balance, result };
          resolve(result);
        },
        (error) => {
          reject({ error });
        }
      );
    });
  },
  verifyPin: (userData) => {
    const { user_id, pin } = userData;
    const frontPin = pin.toString();
    return new Promise((resolve, reject) => {
      Users.findOne({
        where: {
          id: user_id,
        },
      }).then(
        (userData) => {
          let db_pin = userData.dataValues.pin;
          bcrypt.compare(frontPin, db_pin, (err, isMatch) => {
            if (isMatch) {
              resolve({ message: "is Match" });
            } else {
              resolve({ message: "Not Match" });
            }
          });
        },
        (error) => {
          reject({ error });
        }
      );
    });
  },
  withdraw: (transactionData) => {
    const { user_id: id, amount } = transactionData;
    return new Promise((resolve, reject) => {
      Users.findAll({
        where: {
          id,
        },
      }).then(
        (result) => {
          if (result && result.length > 0) {
            let userData = result[0]["dataValues"];
            let withdrawAmount = parseInt(amount);
            let balance = userData["wallet"];
            let totalAmount = balance - withdrawAmount;

            Users.update(
              { wallet: totalAmount },
              {
                where: {
                  id,
                },
              }
            ).then(
              (response) => {
                resolve({ response, totalAmount });
              },
              (err) => {
                reject({ err });
              }
            );
          }
        },
        (error) => {
          reject({ error });
        }
      );
    });
  },
};
