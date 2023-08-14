module.exports = (sequelize, DataTypes) => {
  const Bids = sequelize.define("bids", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    seller_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    buyer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    listing_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pitch: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bidder_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "pending",
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: DataTypes.DATE,
  });
  return Bids;
};
