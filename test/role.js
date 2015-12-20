import assert from 'assert';
import should from 'should';
import sinon from 'sinon';
import {Role, Acl} from '../dist';

describe('Roles', () => {
	let acl;
	before(() => {
		acl = new Acl();
	});
	it('should be declared using only an id', () => {
		((roleId) =>  new Role(roleId)).bind(null, 'user').should.not.throw();
	});

	it('should throw an error if declared using id, parents and without acl', () => {
		((roleId, parents) =>  new Role(roleId, parents)).bind(null, 'user', ['anonymous']).should.throw(Error);
	});

	it('should no throw an error if declared using id, parents and acl', () => {
		let anonymous = new Role('anonymous');
		acl.addRole(anonymous);
		((roleId, parents, acl) =>  new Role(roleId, parents, acl)).bind(null, 'user', ['anonymous'], acl).should.not.throw();
		((roleId, parents, acl) =>  new Role(roleId, parents, acl)).bind(null, 'user', [anonymous], acl).should.not.throw();

	});

	it('should be possible to set a list of parents', () => {
		let anonymous1 = new Role('anonymous1');
		let anonymous2 = new Role('anonymous2');

		acl.addRole(anonymous1).addRole(anonymous2);

		let user = new Role('user', ['anonymous1'], acl);
		acl.addRole(user);
		user.setParents(['anonymous2']).getParent('anonymous2').should.be.an.instanceof(Role);
		user.getParents().should.be.length(1);
	});
	it('should be possible to add a parent by its id', () => {
		let anonymous = new Role('anonymous');
		let user = new Role('user');
		acl.addRole(anonymous).addRole(user);
		user.addParent('anonymous').getParent('anonymous').should.be.an.instanceof(Role);
	});
	it('should be possible to add a parent by its instance', () => {
		let anonymous = new Role('anonymous');
		let user = new Role('user');
		acl.addRole(anonymous).addRole(user);
		user.addParent(anonymous).getParent('anonymous').should.be.an.instanceof(Role);
	});
	it('should be possible to add a list of parents', () => {
		let anonymous = new Role('anonymous');
		let user = new Role('user');
		let admin = new Role('admin');
		acl.addRole(anonymous).addRole(user).addRole(admin);
		admin.addParents(['anonymous', 'user']);
		admin.getParent('user').should.be.an.instanceof(Role);
		admin.getParent('user').getId().should.be.eql('user');
		admin.getParent('anonymous').should.be.an.instanceof(Role);
		admin.getParent('anonymous').getId().should.be.eql('anonymous');

	});
	it('should be possible to remove a parent', () => {
		let anonymous = new Role('anonymous');
		let user = new Role('user');
		let admin = new Role('admin');
		acl.addRole(anonymous).addRole(user).addRole(admin);
		admin.addParents(['anonymous', 'user']);
		admin.removeParent('anonymous');
		should(admin.getParent('anonymous')).be.null;
		admin.getParent('user').should.be.instanceof(Role);
	});
	it('should be possible to remove a list of parents', () => {
		let anonymous = new Role('anonymous');
		let user = new Role('user');
		let admin = new Role('admin');
		acl.addRole(anonymous).addRole(user).addRole(admin);
		admin.addParents(['anonymous', 'user']);
		admin.removeParents(['anonymous', 'user']);
		admin.getParents().should.be.length(0);
	});
});
