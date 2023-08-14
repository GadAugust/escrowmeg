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

//Admins.sync({ alter: true });
//Users.sync({ alter: true });

exports.bidsManagerModel = {
  fetchBids: (userData) => {
    const { page } = userData;
    const limit = 20;

    return new Promise((resolve, reject) => {
      Bids.findAll({
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
  getBidDetails: (userData) => {
    const { id } = userData;
    return new Promise((resolve, reject) => {
      Users.hasOne(Bids, { foreignKey: "bidder_id" });
      Bids.belongsTo(Users, { foreignKey: "bidder_id" });

      Bids.findAll({
        where: {
          id,
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
  getListingDetails: async (bids) => {
    try {
      const arrBid = [];
      for (const bid of bids) {
        const listing = await Listings.findOne({
          where: {
            listing_id: bid.dataValues.listing_id,
          },
        });
        bid.dataValues.listing = listing;
        arrBid.push(bid);
      }
      return arrBid;
    } catch (error) {
      return error;
    }
  },
};
