const Sequelize = require("sequelize");
const sequelize = require("../../configs/connection");
const Listings = require("../../models/listing/listing")(sequelize, Sequelize);
const Users = require("./../../models/auth/users")(sequelize, Sequelize);
const Bids = require("../../models/listing/bids")(sequelize, Sequelize);
const Projects = require("./../../models/project/project")(
  sequelize,
  Sequelize
);
const Images = require("../../models/auth/image-details")(sequelize, Sequelize);
const Op = Sequelize.Op;

/*Listings.sync({ alter: true });
Bids.sync({ alter: true });
Projects.sync({ alter: true });*/

exports.listingModel = {
  addListing: (listingData) => {
    return new Promise((resolve, reject) => {
      Listings.create(listingData).then(
        (listing) => {
          resolve(listing);
        },
        (err) => {
          reject({ err });
        }
      );
    });
  },
  getListings: (listingData) => {
    const { user_id } = listingData;
    return new Promise((resolve, reject) => {
      Listings.findAll({
        where: {
          user_id,
        },
        order: [["id", "DESC"]],
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

  getListingsWithBids: ({ user_id }) => {
    console.log(user_id);
    return new Promise(async (resolve, reject) => {
      Users.hasMany(Bids, { foreignKey: "bidder_id" });
      Bids.belongsTo(Users, { foreignKey: "bidder_id" });
      Bids.findAll({
        where: {
          [Op.not]: { bidder_id: user_id },
          [Op.or]: [{ seller_id: user_id }, { buyer_id: user_id }],
        },
        include: [Users],
        order: [["id", "DESC"]],
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

  getBidsAlongWithListings: async (listings) => {
    try {
      const arrListing = [];
      for (const listing of listings) {
        Users.hasOne(Bids, { foreignKey: "bidder_id" });
        Bids.belongsTo(Users, { foreignKey: "bidder_id" });
        const bids = await Bids.findAll({
          where: { listing_id: listing.dataValues.listing_id },
          include: [{ model: Users }],
        });

        listing.dataValues.bids = bids;
        arrListing.push(listing);
      }
      return arrListing;
    } catch (error) {
      return error;
    }
  },

  getEachListingDetails: async (listings) => {
    try {
      const arrListing = [];
      for (const listing of listings) {
        Users.hasOne(Bids, { foreignKey: "bidder_id" });
        Bids.belongsTo(Users, { foreignKey: "bidder_id" });
        // Users.hasOne(Images, { foreignKey: "userId" });
        // Images.belongsTo(Users, { foreignKey: "userId" });
        const bids = await Bids.findAll({
          where: { listing_id: listing.dataValues.listing_id },
          include: [{ model: Users }],
        });
        listing.dataValues.number_of_bidders = bids.length;
        listing.dataValues.bidders = bids;
        arrListing.push(listing);
      }
      return arrListing;
    } catch (error) {
      return error;
    }
  },

  getAllListings: () => {
    return new Promise((resolve, reject) => {
      Listings.findAll({
        limit: 20,
        order: [["id", "DESC"]],
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

  searchListings: (searchWord) => {
    return new Promise((resolve, reject) => {
      Listings.findAll({
        where: {
          listing_id: searchWord,
        },
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
  addBid: (bidData) => {
    const { role, user_id, bidder_id, listing_id } = bidData;
    if (role == "seller") {
      bidData.seller_id = user_id;
      bidData.buyer_id = bidder_id;
    } else {
      bidData.seller_id = bidder_id;
      bidData.buyer_id = user_id;
    }

    delete bidData.role;
    delete bidData.user_id;
    // delete bidData.bidder_id;

    return new Promise((resolve, reject) => {
      Bids.findAll({
        where: {
          listing_id,
          buyer_id: bidData.buyer_id,
        },
      }).then(
        (result) => {
          if (result && result.length > 0) {
            resolve({ message: "Found" });
          } else {
            Bids.create(bidData).then(
              (resp) => {
                resolve(resp);
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
  getListingBids: (userData) => {
    const { listing_id } = userData;
    return new Promise((resolve, reject) => {
      Users.hasOne(Bids, { foreignKey: "bidder_id" });
      Bids.belongsTo(Users, { foreignKey: "bidder_id" });
      Bids.findAll({
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
  getMyBids: (userData) => {
    const { user_id } = userData;
    return new Promise((resolve, reject) => {
      Bids.findAll({
        where: {
          bidder_id: user_id,
          // [Op.or]: [{ seller_id: user_id }, { buyer_id: user_id }],
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
  confirmBidDecline: (userData) => {
    const { seller_id, buyer_id, listing_id } = userData;

    return new Promise((resolve, reject) => {
      Bids.findAll({
        where: {
          seller_id,
          buyer_id,
          listing_id,
          status: {
            [Op.or]: ["decline", "awarded"],
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
  declineBid: (userData) => {
    const { seller_id, buyer_id, listing_id } = userData;

    return new Promise((resolve, reject) => {
      Bids.update(
        { status: "decline" },
        {
          where: {
            seller_id,
            buyer_id,
            listing_id,
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
  },
  confirmBidAcceptance: (userData) => {
    const { seller_id, buyer_id, listing_id } = userData;

    return new Promise((resolve, reject) => {
      Bids.findAll({
        where: {
          seller_id,
          buyer_id,
          listing_id,
          status: {
            [Op.or]: ["accepted", "awarded"],
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
  acceptBid: (userData) => {
    const { seller_id, buyer_id, listing_id } = userData;

    return new Promise((resolve, reject) => {
      Bids.update(
        { status: "accepted" },
        {
          where: {
            seller_id,
            buyer_id,
            listing_id,
          },
        }
      ).then(
        (response) => {
          resolve(response);
        },
        (error) => {
          reject({ error });
        }
      );
    });
  },
  bidAwarded: (userData) => {
    const { seller_id, buyer_id, listing_id } = userData;
    return new Promise((resolve, reject) => {
      Bids.update(
        { status: "awarded" },
        {
          where: {
            listing_id,
            seller_id,
            buyer_id: {
              [Op.ne]: buyer_id,
            },
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
  addProject: (projectData) => {
    return new Promise((resolve, reject) => {
      Projects.create(projectData).then(
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
