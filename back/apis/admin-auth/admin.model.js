const Sequelize = require("sequelize");
const sequelize = require("../../configs/connection");
const Users = require("./../../models/auth/users")(sequelize, Sequelize);

const bcrypt = require("bcrypt");
const saltRounds = 10;
const Op = Sequelize.Op;
const Mailer = require("./../../libs/emails/mailchimp");
const { response } = require("express");
const { reject } = require("bcrypt/promises");

const Admins = require("../../models/admin/admin")(sequelize, Sequelize);

//Admins.sync({ alter: true });

exports.adminModel = {
  checkEmailExistance: (adminData) => {
    const { email } = adminData;
    return new Promise((resolve, reject) => {
      Admins.findAll({
        where: {
          email,
        },
      }).then(
        (resp) => {
          resolve(resp);
        },
        (error) => {
          reject({ error });
        }
      );
    });
  },
  registerAdmin: (adminData) => {
    const { password } = adminData;

    return new Promise((resolve, reject) => {
      bcrypt.genSalt(saltRounds, (err, Salt) => {
        bcrypt.hash(password, Salt, (err, hash) => {
          if (err) console.log(err);

          console.log("Hashed password : ", hash);
          const updatedAdminData = { ...adminData, password: hash };
          Admins.create(updatedAdminData).then(
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
  loginAdmin: (loginCredentails) => {
    const { email } = loginCredentails;

    return new Promise((resolve, reject) => {
      Admins.findOne({
        where: {
          email,
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
  listAdmins: () => {
    return new Promise((resolve, reject) => {
      Admins.findAll().then(
        (resp) => {
          resolve(resp);
        },
        (error) => {
          reject({ error });
        }
      );
    });
  },
  updateVcode: (email, v_code) => {
    return new Promise((resolve, reject) => {
      Admins.update(
        { v_code },
        {
          where: {
            email,
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
  },
  verifyCode: (userData) => {
    const { v_code, email } = userData;
    return new Promise((resolve, reject) => {
      Admins.findAll({
        where: {
          v_code,
          email,
        },
      }).then(
        (resp) => {
          resolve(resp);
        },
        (error) => {
          reject({ error });
        }
      );
    });
  },
  updatePassword: (userData) => {
    const { password, email } = userData;
    return new Promise((resolve, reject) => {
      bcrypt.genSalt(saltRounds, (err, Salt) => {
        bcrypt.hash(password, Salt, (err, hash) => {
          if (err) return console.log(err);

          Admins.update(
            { password: hash },
            {
              where: {
                email,
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
};
