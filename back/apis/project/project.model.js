const Sequelize = require("sequelize");
const sequelize = require("../../configs/connection");
const Listings = require("../../models/listing/listing")(sequelize, Sequelize);
const Users = require("./../../models/auth/users")(sequelize, Sequelize);
const Bids = require("../../models/listing/bids")(sequelize, Sequelize);
const Projects = require("./../../models/project/project")(
  sequelize,
  Sequelize
);
const Disputes = require("../../models/project/dispute")(sequelize, Sequelize);
const RequestPayment = require("../../models/project/request_payment")(
  sequelize,
  Sequelize
);
const Chats = require("../../models/project/chat")(sequelize, Sequelize);
const Settings = require("../../models/project/settings")(sequelize, Sequelize);
const Op = Sequelize.Op;

//Listings.sync({ alter: true });
//Bids.sync({ alter: true });
//Projects.sync({ alter: true });
//Disputes.sync({ alter: true });
//RequestPayment.sync({ alter: true });
//Chats.sync({ alter: true });
//Settings.sync({ alter: false });

exports.projectModel = {
  fetchOngoingProject: (userData) => {
    const { user_id, status } = userData;
    return new Promise((resolve, reject) => {
      Bids.hasOne(Projects, { foreignKey: "bid_id" });
      Projects.belongsTo(Bids, { foreignKey: "bid_id" });
      Projects.findAll({
        where: {
          [Op.or]: [{ seller_id: user_id }, { buyer_id: user_id }],
          status,
        },
        include: [
          {
            model: Bids,
            attributes: ["createdAt", "updatedAt"],
            required: true,
          },
        ],
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

  fetchCompleteProject: (userData) => {
    const { user_id: seller_id, status } = userData;
    return new Promise((resolve, reject) => {
      Users.hasOne(Projects, { foreignKey: "buyer_id" });
      Bids.hasOne(Projects, { foreignKey: "bid_id" });
      Projects.belongsTo(Users, { foreignKey: "buyer_id" });
      Projects.belongsTo(Bids, { foreignKey: "bid_id" });
      Projects.findAll({
        where: {
          seller_id,
          status,
        },
        include: [
          {
            model: Users,
            attributes: ["last_name", "first_name"],
            required: true,
          },
          {
            model: Bids,
            attributes: ["createdAt", "updatedAt"],
            required: true,
          },
        ],
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

  fetchListingDetails: async (projects) => {
    const arrProject = [];
    try {
      for (const project of projects) {
        const user = await Listings.findOne({
          where: { listing_id: project.dataValues.listing_id },
        });
        project.dataValues.listing = user.dataValues;
        arrProject.push(project);
      }
      return arrProject;
    } catch (error) {
      return error;
    }
  },

  fetchUserProjectDetails: async (projects, user_id) => {
    const arrProject = [];
    let user = {};
    try {
      for (const project of projects) {
        // console.log(project);
        if (project.dataValues.seller_id == user_id) {
          user = await Users.findOne({
            where: { id: project.dataValues.buyer_id },
          });
          project.dataValues.user = user.dataValues;
          arrProject.push(project);
        } else if (project.dataValues.buyer_id == user_id) {
          user = await Users.findOne({
            where: { id: project.dataValues.seller_id },
          });
          project.dataValues.user = user.dataValues;
          arrProject.push(project);
        }
      }
      return arrProject;
    } catch (error) {
      return error;
    }
  },
  raiseDispute: (disputeData) => {
    return new Promise((resolve, reject) => {
      Disputes.create(disputeData).then(
        (resp) => {
          resolve(resp);
        },
        (error) => {
          reject({ error });
        }
      );
    });
  },

  getUserDetails: (disputeData) => {
    const { user_id: id } = disputeData;
    return new Promise((resolve, reject) => {
      Users.findOne({
        where: {
          id,
        },
        // attributes: ["first_name", "last_name"],
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

  getPreviousPayments: (paymentData) => {
    const { project_id } = paymentData;
    return new Promise((resolve, reject) => {
      RequestPayment.findAll({
        where: {
          project_id,
          status: {
            [Op.or]: ["paid", "released", "pending"],
          },
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

  getAcceptedReleasedPreviousPayments: (paymentData) => {
    const { project_id } = paymentData;
    return new Promise((resolve, reject) => {
      RequestPayment.findAll({
        where: {
          project_id,
          status: {
            [Op.or]: ["paid", "released"],
          },
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

  requestPayment: (paymentData) => {
    return new Promise((resolve, reject) => {
      RequestPayment.create(paymentData).then(
        (resp) => {
          resolve(resp);
        },
        (error) => {
          reject({ error });
        }
      );
    });
  },
  requestPaymentHistory: (paymentData) => {
    const { project_id } = paymentData;
    return new Promise((resolve, reject) => {
      RequestPayment.findAll({
        where: {
          project_id,
        },
        order: [["id", "DESC"]],
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
  sendMessage: (chatData) => {
    return new Promise((resolve, reject) => {
      Chats.create(chatData).then(
        (resp) => {
          resolve(resp);
        },
        (error) => {
          reject({ error });
        }
      );
    });
  },
  fetchMessages: (chatData) => {
    const { project_id } = chatData;
    return new Promise((resolve, reject) => {
      Chats.findAll({
        where: {
          project_id,
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
  fetchDisputes: (chatData) => {
    const { project_id } = chatData;
    return new Promise((resolve, reject) => {
      Users.hasOne(Disputes, { foreignKey: "user_id" });
      Disputes.belongsTo(Users, { foreignKey: "user_id" });

      Disputes.findAll({
        where: {
          project_id,
        },
        include: [{ model: Users, attributes: ["first_name", "last_name"] }],
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
  declineRequestPayment: (requestData) => {
    const { project_id, request_payment_id } = requestData;
    return new Promise((resolve, reject) => {
      RequestPayment.update(
        { status: "decline" },
        {
          where: {
            project_id,
            id: request_payment_id,
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
  checkBalance: (requestData) => {
    const { user_id } = requestData;
    return new Promise((resolve, reject) => {
      Users.findAll({
        where: { id: user_id },
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
  acceptRequestPayment: (requestData) => {
    const { project_id, request_payment_id } = requestData;
    return new Promise((resolve, reject) => {
      RequestPayment.update(
        { status: "paid" },
        {
          where: {
            project_id,
            id: request_payment_id,
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
  updateUserBalance: (user_id, amount) => {
    return new Promise((resolve, reject) => {
      Users.update(
        { wallet: amount },
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
  },
  getEskroBalance: () => {
    return new Promise((resolve, reject) => {
      Settings.findOne({
        where: {
          id: 1,
        },
        attributes: ["action", "value"],
      }).then(
        (resp) => {
          resolve(resp);
        },
        (error) => {
          console.log(error);
          reject({ error });
        }
      );
    });
  },
  updateEskroBalance: (amount) => {
    return new Promise((resolve, reject) => {
      Settings.update(
        { value: amount },
        {
          where: {
            id: 1,
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
  releaseFund: (fundData) => {
    console.log(fundData);
    const { request_payment_id, project_id, amount } = fundData;
    return new Promise((resolve, reject) => {
      RequestPayment.update(
        { status: "released", amount_after_charges: amount },
        {
          where: {
            id: request_payment_id,
            project_id: project_id,
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
  getChargesWithBalance: () => {
    return new Promise((resolve, reject) => {
      Settings.findAll({
        where: {
          id: {
            [Op.or]: [1, 2],
          },
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
  getRequestPaymentDetailsAfterRelease: (request_payment_id) => {
    return new Promise((resolve, reject) => {
      RequestPayment.findAll({
        where: {
          id: request_payment_id,
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
  createSettings: (settingsData) => {
    return new Promise((resolve, reject) => {
      Settings.create(settingsData).then(
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
