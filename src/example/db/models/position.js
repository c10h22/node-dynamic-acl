/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
	return sequelize.define('position', {
			id: {
				type: DataTypes.INTEGER(10),
				allowNull: false,
				primaryKey: true
			},
			position: {
				type: 'POINT',
				allowNull: false
			},
			precision: {
				type: DataTypes.INTEGER(3),
				allowNull: false
			},
			date: {
				type: DataTypes.DATE,
				allowNull: false
			},
			user_email: {
				type: DataTypes.STRING,
				allowNull: false,
				references: {
					model: 'user',
					key: 'email'
				}
			}
		},
		{
			freezeTableName: true,
			timestamps: false,
			createdAt: false,
			updatedAt: false,
			deletedAt: false,
			paranoid: true,
		}
	);
};
