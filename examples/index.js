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

var getUserRoleId = function (user) {
	return user.roleId;
};

var getResourceId = function (resource) {
	return resource.resourceId;
};

var userCanMarkPage = function (user, page) {
	if (user.firstname == 'Timmmmy')
		return true;
	return false;
};

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

console.log('---built permissions---');
console.log(acl.getPermissions('visitor'));
console.log(acl.getPermissions('user'));
console.log(acl.getPermissions('admin'));

console.log('---anonymous permissions check---');
console.log('anonymous isAllowed page1:* ' + acl.isAllowed(anonymous, page1)); // false
console.log('anonymous isAllowed page1:read ' + acl.isAllowed(anonymous, page1, 'read')); //true
console.log('anonymous isAllowed page1:mark ' + acl.isAllowed(anonymous, page1, 'mark')); //false
console.log('anonymous isAllowed page1:change title ' + acl.isAllowed(anonymous, page1, 'change title')); //false
console.log('anonymous isAllowed book:* ' + acl.isAllowed(anonymous, book)); //false
console.log('anonymous isAllowed book:sell ' + acl.isAllowed(anonymous, book, 'sell')); //false 			//privilege was not declared previously -> inherit from book:*

console.log('---user permissions check---');
console.log('bob isAllowed page1:* ' + acl.isAllowed(bob, page1)); //true
console.log('bob isAllowed page1:read ' + acl.isAllowed(bob, page1, 'read')); //true
console.log('bob isAllowed page1:mark ' + acl.isAllowed(bob, page1, 'mark')); //false
console.log('bob isAllowed page1:change title ' + acl.isAllowed(bob, page1, 'change title')); //false
console.log('bob isAllowed book:* ' + acl.isAllowed(bob, book)); //false
console.log('bob isAllowed book:sell ' + acl.isAllowed(bob, book, 'sell')); //false 			//privilege was not declared previously -> inherit from book:*

console.log('---admin permissions check---');
console.log('me isAllowed page1:* ' + acl.isAllowed(me, page1)); //true
console.log('me isAllowed page1:read ' + acl.isAllowed(me, page1, 'read')); //true
console.log('me isAllowed page1:mark ' + acl.isAllowed(me, page1, 'mark')); //true
console.log('me isAllowed page1:change title ' + acl.isAllowed(me, page1, 'change title')); //true
console.log('me isAllowed book:* ' + acl.isAllowed(me, book)); // true
console.log('me isAllowed book:sell ' + acl.isAllowed(me, book, 'sell'));//true 			//privilege was not declared previously -> inherit from book:*
