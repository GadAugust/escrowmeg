module.exports = (sequelize, DataTypes) => {
    const PaymentReference = sequelize.define("payment-reference", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      transaction_type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      bank_id: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
      },
      payment_reference: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updatedAt: DataTypes.DATE,
    });
    return PaymentReference;
  };
  