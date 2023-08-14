module.exports = (sequelize, DataTypes) => {
  const RequestPayment = sequelize.define("request_payments", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    project_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    agreed_price: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount_after_charges: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: DataTypes.DATE,
  });
  return RequestPayment;
};
