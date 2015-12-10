import config from '../config';
import Sequelize from 'sequelize';

let database = config.database;
const sequelize = new Sequelize(database.schema, database.username, database.password, {
	host: database.host,
	dialect: 'mysql',
	port: database.port
});

let User = sequelize.import('models/user');
let Device = sequelize.import('models/device');
let Position = sequelize.import('models/position');

export default sequelize;
export {User as User};
export {Device as Device};
export {Position as Position};
