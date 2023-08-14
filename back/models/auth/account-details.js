module.exports = (sequelize, DataTypes) => {
    const AccountDetails = sequelize.define("account-details", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      account_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      bank_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      account_number: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: DataTypes.DATE,
    });
    return AccountDetails;
  };
  