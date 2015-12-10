module.exports = function (sequelize, DataTypes) {
	return sequelize.define('device', {
		uid: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true
		},
		token: {
			type: DataTypes.STRING,
			allowNull: true
		},
		manufacturer: {
			type: DataTypes.STRING,
			allowNull: true
		},
		model: {
			type: DataTypes.STRING,
			allowNull: true
		},
		os: {
			type: DataTypes.STRING,
			allowNull: true
		},
		creation_date: {
			type: DataTypes.DATE,
			allowNull: true
		},
		update_date: {
			type: DataTypes.DATE,
			allowNull: true
		}
	}, {
		freezeTableName: true,
		timestamps: false,
		createdAt: false,
		updatedAt: false,
		deletedAt: false,
		paranoid: true,
	});
};
