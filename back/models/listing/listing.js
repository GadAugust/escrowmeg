module.exports = (sequelize, DataTypes) => {
    const Listings = sequelize.define("listings", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      product: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      payment_type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      listing_id: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: DataTypes.DATE,
    });
    return Listings;
  };
  