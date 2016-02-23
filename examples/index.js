var Acl = require('../dist').Acl;
var Role = require('../dist').Role;
var Resource = require('../dist').Resource;

var anonymous = {
	roleId: 'visitor'
};
var bob = {
	firstname: 'Bob',
	lastname: 'Marley',
	roleId: 'user'
};

var me = {
	firtname: 'Timmmmy',
	lastname: 'Timmmmy',
	roleId: 'admin'
};

var page1 = {
	id: 'page 1',
	title: 'Go further with node',
	resourceId: 'page'
};

var book = {
	id: 'book 1',
	title: 'Go further with JS',
	resourceId: 'book'
};

var getUserRoleId = (user) => new Promise(resolve => resolve(user.roleId));

var getResourceId = (resource) => new Promise(resolve => resolve(resource.resourceId));

var userCanMarkPage = (user, page) => new Promise((resolve,reject) => {
	if (user.firstname == 'Timmmmy')
		return resolve();
	return reject();
});

var acl = new Acl(getUserRoleId, getResourceId);
acl.addRole('visitor') // equivalent to acl.addRole(new Role('visitor', [], acl))
	.addRole(new Role('user', ['visitor'], acl))
	.addRole('admin', ['user']) //equivalent to acl.addRole(new Role('admin', ['user'], acl))
	.addResource(new Resource('page', ['read', 'mark', 'change title']))
	.addResource(new Resource('book'))
	.build();

acl.allow('visitor', 'page', 'read')
	.allow('user', 'page')
	.allow('user', 'page', 'mark', userCanMarkPage)
	.deny('user', 'page', 'change title')
	.allow('admin', 'page', 'change title')
	.allow('admin', 'book');

//console.log('---built permissions---');
//console.log('---visitor---');
//console.log(acl.getPermissions('visitor'));
//console.log('---user---');
//console.log(acl.getPermissions('user'));
//console.log('---admin---');
//console.log(acl.getPermissions('admin'));

//console.log('---anonymous permissions check---');
acl.isAllowed(anonymous, page1).then(
	() => {
		// anonymous should not be allowed
		console.error('This should not be printed in console');
	},
	() => {
		// anonymous is not allowed
		console.log('anonymous isAllowed page1:* -> false');
	}
);

acl.isAllowed(anonymous, page1, 'read').then(
	// anonymous is allowed
	() => {console.log('anonymous isAllowed page1:read -> true')},
	() => {console.error('This should not be printed in console')}
);

acl.isAllowed(anonymous, page1, 'mark').then(
	() => {console.error('This should not be printed in console')},
	// anonymous is not allowed
	() => {console.log('anonymous isAllowed page1:mark -> false')}
);

acl.isAllowed(anonymous, page1, 'change title').then(
	() => {console.error('This should not be printed in console')},
	// anonymous is not allowed
	() => {console.log('anonymous isAllowed page1:change title -> false')}
);

acl.isAllowed(anonymous, book).then(
	() => {console.error('This should not be printed in console')},
	// anonymous is not allowed
	() => {console.log('anonymous isAllowed book:* -> false')}
);

acl.isAllowed(anonymous, book, 'sell').then(
	() => {console.error('This should not be printed in console')},
	// anonymous is not allowed
	() => {console.log('anonymous isAllowed book:sell -> false')}
);


//console.log('---user permissions check---');
acl.isAllowed(bob, page1).then(
	() => {console.log('bob isAllowed page1:* -> true')},
	() => {console.error('This should not be printed in console')}
);

acl.isAllowed(bob, page1, 'read').then(
	() => {console.log('bob isAllowed page1:read -> true')},
	() => {console.error('This should not be printed in console')}
);

acl.isAllowed(bob, page1, 'mark').then(
	() => {console.error('This should not be printed in console')},
	() => {console.log('bob isAllowed page1:mark -> false')}
);

acl.isAllowed(bob, page1, 'change title').then(
	() => {console.error('This should not be printed in console')},
	() => {console.log('bob isAllowed page1:change title -> false')}
);

acl.isAllowed(bob, book, 'book:*').then(
	() => {console.error('This should not be printed in console')},
	() => {console.log('bob isAllowed book:* -> false')}
);

acl.isAllowed(bob, book, 'book:sell').then(
	() => {console.error('This should not be printed in console')},
	() => {console.log('bob isAllowed book:sell -> false')}//privilege was not declared previously -> inherit from book:*
);

//console.log('---admin permissions check---');
acl.isAllowed(me, page1).then(
	() => {console.log('me isAllowed page1:* -> true')},
	() => {console.error('This should not be printed in console')}
);
acl.isAllowed(me, page1, 'read').then(
	() => {console.log('me isAllowed page1:read -> true')},
	() => {console.error('This should not be printed in console')}
);
acl.isAllowed(me, page1, 'mark').then(
	() => {console.log('me isAllowed page1:mark -> true')},
	() => {console.error('This should not be printed in console')}
);
acl.isAllowed(me, page1, 'change title').then(
	() => {console.log('me isAllowed page1:change title -> true')},
	() => {console.error('This should not be printed in console')}
);
acl.isAllowed(me, book).then(
	() => {console.log('me isAllowed book:* -> true')},
	() => {console.error('This should not be printed in console')}
);
acl.isAllowed(me, book, 'sell').then(
	() => {console.log('me isAllowed book:sell -> true')},//privilege was not declared previously -> inherit from book:*
	() => {console.error('This should not be printed in console')}
);

