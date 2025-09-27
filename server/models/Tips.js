
/** @format */
module.exports = (sequelize, DataTypes) => {
  const Tips = sequelize.define("Tips", {
		league: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		date: {
			type: DataTypes.DATE,
			allowNull: false
		},
		time: {
			type: DataTypes.TIME,
			allowNull: false
		},
		match: {

			type: DataTypes.STRING,
			allowNull: false,
		},
		prediction: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		odds: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		results: {
			type: DataTypes.ENUM("win",	"loss", "pending"),
			allowNull: false,
			defaultValue: "pending",
		},
		tipsType: {
			type: DataTypes.ENUM("client", "vip"),//TODO add premium and remove "vipOne", "vipTwo", "vipThree" and visit payment controller
			allowNull: false,
			defaultValue: "client",
		},
	});

	return Tips;

}

