const Sequelize = require("sequelize");
const sequelize = require("../../configs/connection");

const bcrypt = require("bcrypt");
const saltRounds = 10;
const Op = Sequelize.Op;
const Mailer = require("./../../libs/emails/mailchimp");
const { response } = require("express");
const { reject } = require("bcrypt/promises");

const Users = require("./../../models/auth/users")(sequelize, Sequelize);
const Listings = require("../../models/listing/listing")(sequelize, Sequelize);
const Bids = require("../../models/listing/bids")(sequelize, Sequelize);
const Projects = require("../../models/project/project")(sequelize, Sequelize);
const Disputes = require("../../models/project/dispute")(sequelize, Sequelize);
const RequestPayment = require("../../models/project/request_payment")(
  sequelize,
  Sequelize
);

// Admins.sync({ alter: true });
// Users.sync({ alter: true });

exports.disputesManagerModel = {
  fetchDisputes: () => {
    return new Promise((resolve, reject) => {
      Disputes.findAll({
        attributes: [
          "project_id",
          "id",
          "user_id",
          "subject",
          "complain",
          "role",
          "createdAt",
          "updatedAt",
          "img_url",
          "admin_id",
          "receiver_id",
        ],
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
};
