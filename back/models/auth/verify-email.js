module.exports = (sequelize, DataTypes) => {
    const EmailVerification = sequelize.define("email_verification", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      v_code: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: DataTypes.DATE,
    });
    return EmailVerification;
  };
  