/** @format */
module.exports = (sequelize, DataTypes) => {
  const Payments = sequelize.define("Payments", {
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    reference: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    checkoutRequestId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mpesaReceiptNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
  });

  Payments.associate = (models) => {
    Payments.belongsTo(models.Users, {
      foreignKey: "userId",
      as: "user",
      onDelete: "CASCADE",
    });
  };

  return Payments;
};
