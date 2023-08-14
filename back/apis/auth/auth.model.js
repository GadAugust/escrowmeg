const Sequelize = require("sequelize");
const sequelize = require("../../configs/connection");
const Users = require("./../../models/auth/users")(sequelize, Sequelize);
const EmailVerification = require("./../../models/auth/verify-email")(
  sequelize,
  Sequelize
);
const AccountDetails = require("./../../models/auth/account-details")(
  sequelize,
  Sequelize
);
const Images = require("./../../models/auth/image-details")(
  sequelize,
  Sequelize
);
const bcrypt = require("bcrypt");
const saltRounds = 10;
const Op = Sequelize.Op;
const Mailer = require("./../../libs/emails/mailchimp");
const { response } = require("express");
const { reject } = require("bcrypt/promises");

/*Users.sync({ alter: true });
EmailVerification.sync({ alter: true });
AccountDetails.sync({ alert: true });
Images.sync({ alter: true });*/

exports.authModel = {
  emailConfirmation: (email, v_code) => {
    return new Promise((resolve, reject) => {
      EmailVerification.findAll({
        where: {
          email,
        },
      }).then(
        (result) => {
          if (result.length === 0) {
            console.log("IF BLOCK >>>>>>>>>>>");
            EmailVerification.create({ email, v_code }).then(
              (user) => {
                resolve(user);
              },
              (err) => {
                reject({ err });
              }
            );
          } else {
            EmailVerification.update(
              { v_code },
              {
                where: {
                  email,
                },
              }
            ).then(
              (user) => {
                resolve(user);
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
  emailVerification: (email) => {
    return new Promise((resolve, reject) => {
      EmailVerification.findAll({
        where: {
          email,
        },
      }).then(
        (resp) => {
          resolve(resp);
        },
        (err) => {
          reject({ err });
        }
      );
    });
  },

  twoWayEmailVerification: async (email) => {
    try {
      const emailTableCount = await EmailVerification.count({
        where: { email },
      });
      const userTableCount = await Users.count({ where: { email } });

      return { emailTableCount, userTableCount };
    } catch (error) {
      return { error };
    }
  },

  verifyEmail: (userData) => {
    const { email } = userData;
    return new Promise(
      (resolve, reject) => {
        this.authModel.emailVerification(email).then(
          (result) => {
            resolve(result);
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
  verifyCode: (userData) => {
    const { email, v_code } = userData;
    return new Promise((resolve, reject) => {
      EmailVerification.findOne({
        where: {
          email,
          v_code,
        },
      }).then(
        (userData) => {
          resolve(userData);
        },
        (error) => {
          reject({ error });
        }
      );
    });
  },
  register: (user) => {
    let { email, password } = user;

    return new Promise((resolve, reject) => {
      bcrypt.genSalt(saltRounds, (err, Salt) => {
        bcrypt.hash(password, Salt, (err, hash) => {
          if (err) console.log(err);

          console.log("Hashed password : ", hash);
          const updatedUserData = { ...user, password: hash };
          Users.create(updatedUserData).then(
            (user) => {
              resolve(user);
            },
            (err) => {
              reject({ err });
            }
          );
        });
      });
    });
  },
  login: (loginCredential) => {
    let { email, password } = loginCredential;
    Users.hasOne(Images, { foreignKey: "user_id" });
    Images.belongsTo(Users, { foreignKey: "user_id" });

    return new Promise((resolve, reject) => {
      Users.findOne({
        where: {
          email,
        },
        include: Images,
      }).then(
        (userData) => {
          resolve(userData);
        },
        (error) => {
          reject({ error });
        }
      );
    });
  },
  forgotPassword: (userData) => {
    const { email } = userData;
    return new Promise(
      (resolve, reject) => {
        this.authModel.emailVerification(email).then(
          (result) => {
            resolve(result);
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
  updatePassword: (password, email) => {
    return new Promise((resolve, reject) => {
      bcrypt.genSalt(saltRounds, (err, Salt) => {
        bcrypt.hash(password, Salt, (err, hash) => {
          if (err) return console.log(err);

          console.log(hash);
          Users.update(
            { password: hash },
            {
              where: {
                email,
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
  accountVerification: (account_number) => {
    return new Promise((resolve, reject) => {
      AccountDetails.findAll({
        where: {
          account_number,
        },
      }).then(
        (resp) => {
          resolve(resp);
        },
        (err) => {
          reject({ err });
        }
      );
    });
  },
  addAccountDetails: (accountData) => {
    const { account_number } = accountData;
    return new Promise((resolve, reject) => {
      this.authModel.accountVerification(account_number).then(
        (resp) => {
          if (resp.length > 0) {
            resolve({ message: "Found" });
          } else {
            AccountDetails.create(accountData).then(
              (accData) => {
                if (accData.dataValues) {
                  resolve({ message: "Not Found" });
                }
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
  fetchAccounts: (accountData) => {
    const { user_id } = accountData;
    return new Promise((resolve, reject) => {
      AccountDetails.findAll({
        where: {
          userId: user_id,
        },
        order: [["id", "DESC"]],
      }).then(
        (resp) => {
          resolve(resp);
        },
        (err) => {
          reject({ err });
        }
      );
    });
  },
  updateAccountDetails: (accountData) => {
    const { account_number } = accountData;
    return new Promise((resolve, reject) => {});
  },
  addProfilePics: (imageData) => {
    const { user_id, img_url } = imageData;
    console.log("Image Data >>>>>>>>>>>>>>>>>>>", imageData);
    return new Promise((resolve, reject) => {
      Images.findAll({
        where: {
          user_id,
        },
      }).then(
        (result) => {
          if (result.length > 0) {
            Images.update(
              { img_url },
              {
                where: {
                  user_id,
                },
              }
            ).then(
              (resp) => {
                if (resp[0] > 0) {
                  Images.findOne({
                    where: {
                      user_id,
                    },
                  }).then(
                    (result) => {
                      resolve(result);
                    },
                    (err) => {
                      reject({ err });
                    }
                  );
                } else {
                  reject({ error: "Couldn't update" });
                }
              },
              (error) => {
                reject({ error });
              }
            );
          } else {
            Images.create(imageData).then(
              (imgData) => {
                resolve(imgData);
              },
              (error) => {
                reject({ error });
              }
            );
          }
        },
        (err) => {
          reject({ err });
        }
      );
    });
  },
  addTransactionPin: (userData) => {
    const { user_id, pin, email } = userData;
    return new Promise((resolve, reject) => {
      bcrypt.genSalt(saltRounds, (err, Salt) => {
        bcrypt.hash(pin, Salt, (err, hash) => {
          if (err) console.log(err);

          console.log("Hashed pin : ", hash);
          Users.update(
            { pin: hash, onboarded: true },
            {
              where: {
                id: user_id,
                email,
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
