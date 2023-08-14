const Sequelize = require("sequelize");
const sequelize = require("../../configs/connection");
const { authModel } = require("./../auth/auth.model");
const Op = Sequelize.Op;
const Users = require("../../models/auth/users")(sequelize, Sequelize);
const bcrypt = require("bcrypt");
const saltRounds = 10;

exports.settingsModel = {
  verifyPassword: (userData) => {
    const { user_id, old_password } = userData;
    return new Promise((resolve, reject) => {
      Users.findOne({
        where: {
          id: user_id,
        },
      }).then(
        (userData) => {
          let db_password = userData.dataValues.password;
          bcrypt.compare(old_password, db_password, (err, isMatch) => {
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
  changePassword: (userData) => {
    const { user_id, new_password } = userData;
    return new Promise((resolve, reject) => {
      bcrypt.genSalt(saltRounds, (err, Salt) => {
        bcrypt.hash(new_password, Salt, (err, hash) => {
          if (err) console.log(err);

          console.log("Hashed password : ", hash);
          Users.update(
            { password: hash },
            {
              where: {
                id: user_id,
              },
            }
          ).then(
            (resp) => {
              resolve(resp);
            },
            (error) => {
              reject({ error });
            }
          );
        });
      });
    });
  },
  changePin: (userData) => {
    const { user_id, new_pin } = userData;
    const newPin = new_pin.toString();
    return new Promise((resolve, reject) => {
      bcrypt.genSalt(saltRounds, (err, Salt) => {
        bcrypt.hash(newPin, Salt, (err, hash) => {
          if (err) console.log(err);

          console.log("Hashed password : ", hash);
          Users.update(
            { pin: hash },
            {
              where: {
                id: user_id,
              },
            }
          ).then(
            (resp) => {
              resolve(resp);
            },
            (error) => {
              reject({ error });
            }
          );
        });
      });
    });
  },
  forgotPin: (userData) => {
    const { email } = userData;

    return new Promise(
      (resolve, reject) => {
        authModel.emailVerification(email).then(
          (resp) => {
            resolve(resp);
          },
          (error) => {
            reject({ error });
          }
        );
      },
      (err) => {
        reject({ err });
      }
    );
  },
  updatePin: (pin, user_id) => {
    const newPin = pin.toString();
    return new Promise((resolve, reject) => {
      bcrypt.genSalt(saltRounds, (err, Salt) => {
        bcrypt.hash(newPin, Salt, (err, hash) => {
          if (err) return console.log(err);

          console.log(hash);
          Users.update(
            { pin: hash },
            {
              where: {
                id: user_id,
              },
            }
          ).then(
            (result) => {
              resolve(result);
            },
            (error) => {
              reject({ error });
            }
          );
        });
      });
    });
  },
};
