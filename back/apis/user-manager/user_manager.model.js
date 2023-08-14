const Sequelize = require("sequelize");
const sequelize = require("../../configs/connection");

const bcrypt = require("bcrypt");
const saltRounds = 10;
const Op = Sequelize.Op;
const Mailer = require("./../../libs/emails/mailchimp");
const { response } = require("express");
const { reject } = require("bcrypt/promises");

const Admins = require("../../models/admin/admin")(sequelize, Sequelize);
const Users = require("./../../models/auth/users")(sequelize, Sequelize);
const Listings = require("../../models/listing/listing")(sequelize, Sequelize);
const Bids = require("../../models/listing/bids")(sequelize, Sequelize);
const Projects = require("../../models/project/project")(sequelize, Sequelize);
const Disputes = require("../../models/project/dispute")(sequelize, Sequelize);
const RequestPayment = require("../../models/project/request_payment")(
  sequelize,
  Sequelize
);
var _ = require("lodash");

// Admins.sync({ alter: true });
// Users.sync({ alter: true });

exports.userManagerModel = {
  fetchAdminSummary: () => {
    return new Promise(async (resolve, reject) => {
      try {
        const userCount = await Users.count();
        const adminCount = await Admins.count();
        const listingsCount = await Listings.count();
        const bidsCount = await Bids.count();
        const projectCount = await Projects.count();
        const disputeCount = await Disputes.count();
        const totalAmountPaid = await RequestPayment.findAll({
          where: {
            [Op.or]: [{ status: "released" }, { status: "paid" }],
          },
          attributes: [
            [
              Sequelize.fn("SUM", Sequelize.literal("amount::integer")),
              "totalAmountPaid",
            ],
          ],
        });
        const totalCharges = await RequestPayment.findAll(
          // Sequelize.literal("(amount::integer - amount_after_charges)"),
          {
            where: {
              status: "released",
            },
            attributes: [
              [
                Sequelize.literal(
                  "SUM(amount::integer - amount_after_charges::integer)"
                ),
                "totalCharges",
              ],
            ],
          }
        );

        resolve: ({
          userCount,
          adminCount,
          listingsCount,
          bidsCount,
          projectCount,
          disputeCount,
          totalAmountPaid,
          totalCharges,
        });
      } catch (error) {
        reject: ({ error });
      }
    });
  },
  userDashboard: (userData) => {
    const { user_id } = userData;
    return new Promise(async (resolve, reject) => {
      try {
        const userListingCount = await Listings.count({ where: { user_id } });
        const userProjectCount = await Projects.count({
          where: { [Op.or]: [{ seller_id: user_id }, { buyer_id: user_id }] },
        });
        const WalletBalance = await Users.findOne({
          where: { id: user_id },
          attributes: ["wallet"],
        });
        const userWalletBalance = WalletBalance.dataValues.wallet;

        const targetUserProject = await Projects.findAll({
          where: {
            buyer_id: user_id,
          },
          attributes: ["id"],
        });

        let arrayProjectIds = [];
        let totalPaymentReleased = 0;

        targetUserProject.map(async (project, index) => {
          arrayProjectIds.push(project.dataValues.id);
          if (targetUserProject.length - 1 == index) {
            const totalRelasedPayment = await RequestPayment.findAll({
              where: {
                project_id: arrayProjectIds,
                status: "released",
              },
            });

            totalPaymentReleased = _.sumBy(
              totalRelasedPayment,
              function (payment) {
                return parseInt(payment.dataValues.amount);
              }
            );
            // console.log("TotalPayment Released >>>>>>>>>>>>>", relPayment);
            resolve({
              userListingCount,
              userProjectCount,
              userWalletBalance,
              totalPaymentReleased,
            });
          }
        });
        resolve({
          userListingCount,
          userProjectCount,
          userWalletBalance,
          totalPaymentReleased,
        });
      } catch (error) {
        reject({ error });
      }
    });
  },
  fetchAllUser: (userData) => {
    const { page } = userData;
    const limit = 20;

    return new Promise((resolve, reject) => {
      Users.findAll({
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
  searchUsers: (searchKeyword) => {
    return new Promise((resolve, reject) => {
      Users.findAll({
        where: {
          [Sequelize.Op.or]: [
            { first_name: { [Op.like]: `%${searchKeyword}%` } },
            { last_name: { [Op.like]: `%${searchKeyword}%` } },
          ],
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
  fetchUserForEachMonth: (userData) => {
    const { year } = userData;
    return new Promise((resolve, reject) => {
      Users.findAll({
        attributes: [
          [
            Sequelize.fn("date_trunc", "month", Sequelize.col("createdAt")),
            "month",
          ],
          [Sequelize.fn("count", Sequelize.col("id")), "count"],
        ],
        where: Sequelize.where(
          Sequelize.fn("date_part", "year", Sequelize.col("createdAt")),
          year
        ),
        group: [
          Sequelize.fn("date_trunc", "month", Sequelize.col("createdAt")),
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
  fetchPayoutForEachMonth: (userData) => {
    const { year } = userData;

    return new Promise((resolve, reject) => {
      const startDate = new Date(year, 0, 1); // January 1st of the given year
      const endDate = new Date(year, 11, 31, 23, 59, 59); // December 31st of the given year

      RequestPayment.findAll({
        attributes: [
          [
            Sequelize.fn("date_trunc", "month", Sequelize.col("createdAt")),
            "month",
          ],
          [
            Sequelize.fn(
              "SUM",
              sequelize.cast(sequelize.col("amount"), "INTEGER")
            ),
            "total_amount",
          ],
        ],
        where: {
          createdAt: {
            [Op.between]: [startDate, endDate],
          },
        },
        group: [
          Sequelize.fn("date_trunc", "month", Sequelize.col("createdAt")),
        ],
        raw: true,
      }).then(
        (resp) => {
          const monthlyPayments = {};
          for (const row of resp) {
            const month = new Date(row.month).getMonth();
            const totalAmount = parseInt(row.total_amount) || 0;
            monthlyPayments[month] = totalAmount;
          }

          for (let i = 0; i < 12; i++) {
            if (!(i in monthlyPayments)) {
              monthlyPayments[i] = 0;
            }
          }

          resolve(monthlyPayments);
        },
        (error) => {
          reject({ error });
        }
      );
    });
  },
  fetchUserListings: (userData) => {
    const { user_id } = userData;
    return new Promise((resolve, reject) => {
      Listings.findAll({
        where: {
          user_id,
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
  fetchUserProjects: (userData) => {
    const { user_id } = userData;

    return new Promise((resolve, reject) => {
      Projects.findAll({
        where: {
          [Op.or]: [{ seller_id: user_id }, { buyer_id: user_id }],
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

  fetchUserDetails: async (projects, user_id) => {
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

  fetchUserListingDetails: async (projects) => {
    const arrProject = [];
    let listing = {};
    try {
      for (const project of projects) {
        // console.log(project);
        listing = await Listings.findOne({
          where: { listing_id: project.dataValues.listing_id },
        });
        project.dataValues.listing = listing.dataValues;
        arrProject.push(project);
      }
      return arrProject;
    } catch (error) {
      return error;
    }
  },

  fetchUserBids: (userData) => {
    const { user_id } = userData;

    return new Promise((resolve, reject) => {
      Bids.findAll({
        where: {
          bidder_id: user_id,
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
  fetchUserBidDetails: async (projects) => {
    const arrProject = [];
    let user = {};
    try {
      for (const project of projects) {
        console.log(project.dataValues.seller_id);
        console.log(project.dataValues.buyer_id);
        console.log(project.dataValues.bidder_id);
        if (project.dataValues.seller_id == project.dataValues.bidder_id) {
          user = await Users.findOne({
            where: { id: project.dataValues.buyer_id },
          });
          project.dataValues.user = user.dataValues;
          arrProject.push(project);
        } else {
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
  PaymentsRequested: (userData) => {
    const { user_id } = userData;
    return new Promise((resolve, reject) => {
      Projects.hasOne(RequestPayment, { foreignKey: "project_id" });
      RequestPayment.belongsTo(Projects, { foreignKey: "project_id" });

      RequestPayment.findAll({
        where: {
          user_id,
        },
        include: [{ model: Projects }],
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

  fetchListingDetailsRequestPayment: async (projects) => {
    const arrProject = [];
    let listing = {};
    try {
      for (const project of projects) {
        // console.log(project);
        listing = await Listings.findOne({
          where: { listing_id: project.dataValues.project.listing_id },
        });
        project.dataValues.listing = listing.dataValues;
        arrProject.push(project);
      }
      return arrProject;
    } catch (error) {
      return error;
    }
  },

  fetchUserPaymentRequestDetails: async (projects) => {
    const arrProject = [];
    let user = {};
    try {
      for (const project of projects) {
        user = await Users.findOne({
          where: { id: project.dataValues.project.bidder_id },
        });
        project.dataValues.user = user.dataValues;
        arrProject.push(project);
      }
      return arrProject;
    } catch (error) {
      return error;
    }
  },

  PaymentsReleased: (userData) => {
    return new Promise((resolve, reject) => {
      Projects.hasOne(RequestPayment, { foreignKey: "project_id" });
      RequestPayment.belongsTo(Projects, { foreignKey: "project_id" });

      RequestPayment.findAll({
        where: {
          status: "released",
        },
        include: Projects,
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
  fetchUserPaymentReleasedDetails: async (projects, user_id) => {
    try {
      const arrayPaymentReleased = await projects.filter(
        (project) => project.project.bidder_id == user_id
      );
      return arrayPaymentReleased;
    } catch (error) {
      return error;
    }
  },
  fetchTotalChargesByMonth: (userData) => {
    const { year } = userData;

    return new Promise((resolve, reject) => {
      const startDate = new Date(year, 0, 1); // January 1st of the given year
      const endDate = new Date(year, 11, 31, 23, 59, 59); // December 31st of the given year

      RequestPayment.findAll({
        attributes: [
          [
            Sequelize.fn("date_trunc", "month", Sequelize.col("createdAt")),
            "month",
          ],
          [
            Sequelize.fn(
              "SUM",
              sequelize.cast(sequelize.col("amount"), "INTEGER")
            ),
            "total_amount",
          ],
        ],
        where: {
          createdAt: {
            [Op.between]: [startDate, endDate],
          },
        },
        group: [
          Sequelize.fn("date_trunc", "month", Sequelize.col("createdAt")),
        ],
        raw: true,
      }).then(
        (resp) => {
          const monthlyPayments = {};
          for (const row of resp) {
            const month = new Date(row.month).getMonth();
            const totalAmount = parseInt(row.total_amount) || 0;
            monthlyPayments[month] = totalAmount;
          }

          for (let i = 0; i < 12; i++) {
            if (!(i in monthlyPayments)) {
              monthlyPayments[i] = 0;
            }
          }

          resolve(monthlyPayments);
        },
        (error) => {
          reject({ error });
        }
      );
    });
  },
};
