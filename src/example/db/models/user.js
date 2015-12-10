import config from '../../config';

module.exports = function (sequelize, DataTypes) {
	return sequelize.define('user', {
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				primaryKey: true
			},
			first_name: {
				type: DataTypes.STRING,
				allowNull: true
			},
			last_name: {
				type: DataTypes.STRING,
				allowNull: true
			},
			gender: {
				type: DataTypes.ENUM('M', 'F'),
				allowNull: true,
				defaultValue: 'M'
			},
			avatar_url: {
				type: DataTypes.STRING,
				allowNull: true
			},
			phone_number: {
				type: DataTypes.STRING,
				allowNull: true
			},
			creation_date: {
				type: DataTypes.DATE,
				allowNull: true
			},
			confirmation_token: {
				type: DataTypes.STRING,
				allowNull: true
			},
			confirmation_date: {
				type: DataTypes.DATE,
				allowNull: true
			},
			update_date: {
				type: DataTypes.DATE,
				allowNull: true
			},
			password: {
				type: DataTypes.STRING,
				allowNull: true
			},
			status: {
				type: DataTypes.ENUM('CONFIRMED', 'NOT CONFIRMED', 'DESACTIVATED'),
				allowNull: false,
				defaultValue: 'NOT CONFIRMED'
			},
			password_reset_token: {
				type: DataTypes.STRING,
				allowNull: true
			},
			password_reset_date: {
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
			instanceMethods: {
				getRoleId: function () {
					return 'user';
				}
			}
		}
	)
};

