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

exports.projectsManagerModel = {
  fetchProjects: (userData) => {
    const { page } = userData;
    const limit = 20;

    return new Promise((resolve, reject) => {
      Projects.findAll({
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
  getProjectDetails: (userData) => {
    const { id } = userData;
    return new Promise((resolve, reject) => {
      Bids.hasOne(Projects, { foreignKey: "bid_id" });
      Projects.belongsTo(Bids, { foreignKey: "bid_id" });
      Projects.hasMany(Disputes, { foreignKey: "project_id" }); // The foreign key in the Project model referencing the User model
      Disputes.belongsTo(Projects, { foreignKey: "project_id" }); // The foreign key in the Project model referencing the User model
      Projects.hasMany(RequestPayment, { foreignKey: "project_id" });
      RequestPayment.belongsTo(Projects, { foreignKey: "project_id" });
      Users.hasOne(Projects, { foreignKey: "seller_id" });
      Projects.belongsTo(Users, { foreignKey: "seller_id" });
      // Users.hasOne(Projects, { foreignKey: "buyer_id", as: "buyerProject" });
      // Projects.belongsTo(Users, { foreignKey: "buyer_id", as: "buyer" });

      Projects.findAll({
        where: {
          id,
        },
        include: [
          { model: Disputes },
          { model: RequestPayment },
          { model: Bids },
          { model: Users },
          // { model: Users, as: "buyer" },
        ],
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
  fetchListingDetails: async (projects) => {
    const arrProject = [];
    try {
      for (const project of projects) {
        const user = await Listings.findOne({
          where: {
            listing_id: project.dataValues.listing_id,
          },
        });
        project.dataValues.listing = user.dataValues;
        arrProject.push(project);
      }
      return arrProject;
    } catch (error) {
      return error;
    }
  },

  fetchBuyerDetails: async (projects) => {
    const arrProject = [];
    try {
      for (const project of projects) {
        const user = await Users.findOne({
          where: {
            id: project.dataValues.buyer_id,
          },
        });
        project.dataValues.buyer = user.dataValues;
        arrProject.push(project);
      }
      return arrProject;
    } catch (error) {
      return error;
    }
  },
  fetchBidsDetails: async (projects) => {
    const arrProject = [];
    try {
      for (const project of projects) {
        const user = await Bids.findOne({
          where: {
            listing_id: project.dataValues.listing_id,
            buyer_id: project.dataValues.buyer_id,
            seller_id: project.dataValues.seller_id,
          },
        });
        project.dataValues.bid = user.dataValues;
        arrProject.push(project);
      }
      return arrProject;
    } catch (error) {
      return error;
    }
  },
};
