import Acl from '../index';
import sequelize from './db';
import {User, Device, Position} from './db';

let acl = new Acl();
acl.addRole('anonyme')
	.addRole('user', ['anonyme'])
	.addRole('admin', ['user'])
	.addResource(User, ['post', 'get'])
	.addResource(Device, ['find', 'get', 'post', 'delete', 'put'])
	.addResource(Position);

acl.deny('anonyme', Device);
acl.allow('anonyme', Device, 'post', (user, device)=> {
	if (user.email == device.owner_email)
		return true;
	return false;
});

acl.allow('user', User, 'post', (authenticatedUser, user) => {
	return false;
});


console.log('acls.anonyme.user', acl.acls.anonyme.user);
console.log('acls.user.user', acl.acls.user.user);

Promise.all([User.findById('adnene.khalfa@wistiki.com'), Device.findById('123'), Position.findById(1)]).then((values)=> {
	let user = values[0];
	let device = values[1];
	let position = values[2];
	console.log("acl.isAllowed(user, user, 'post')", acl.isAllowed(user, device, 'post'));
	console.log("acl.isAllowed(user, user, 'get')", acl.isAllowed(user, user, 'get'));
	//console.log(acl.isAllowed(user, position, 'post'));

});
// Check database connection
sequelize.authenticate().then(function (err) {
	if (err) {
		console.log('Unable to connect to the database:', err);
	} else {
		console.log('Connection has been established successfully.');
	}
});



