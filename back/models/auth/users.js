module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define("users", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    occupation: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    onboarded: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    pin: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    wallet: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: DataTypes.DATE,
  });
  return Users;
};
