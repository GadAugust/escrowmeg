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

// Admins.sync({ alter: true });
// Users.sync({ alter: true });

exports.listingsManagerModel = {
  fetchListings: (userData) => {
    const { page } = userData;
    const limit = 50;

    return new Promise((resolve, reject) => {
      Listings.findAll({
        limit,
        offset: page ? (page - 1) * limit : 0,
        order: [["id", "ASC"]],
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

  searchListings: (searchWord) => {
    const limit = 50;
    return new Promise((resolve, reject) => {
      Listings.findAll({
        where: {
          listing_id: {
            [Op.like]: `%${searchWord}%`,
          },
        },
        limit,
        // offset: page ? (page - 1) * limit : 0,
        order: [["id", "ASC"]],
      }).then(
        (result) => {
          resolve(result);
        },
        (error) => {
          reject({ error });
        }
      );
    });
  },

  getListingDetails: (userData) => {
    const { listing_id } = userData;
    return new Promise((resolve, reject) => {
      Users.hasOne(Listings, { foreignKey: "user_id" }); // The foreign key in the Project model referencing the User model
      Listings.belongsTo(Users, { foreignKey: "user_id" }); // The foreign key in the Project model referencing the User model

      Listings.findAll({
        where: {
          listing_id,
        },
        include: Users,
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
};
