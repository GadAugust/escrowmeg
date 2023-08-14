module.exports = (sequelize, DataTypes) => {
  const Disputes = sequelize.define("disputes", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    receiver_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    admin_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    project_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    complain: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    img_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: DataTypes.DATE,
  });
  return Disputes;
};
