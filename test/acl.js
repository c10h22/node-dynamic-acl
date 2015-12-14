import assert from 'assert';
import should from 'should';
import sinon from 'sinon';
import _ from 'lodash';
import {Acl, Role} from '../dist';

var acl;
var user = {
	firstname: 'bob',
	lastname: 'marley',
	getRoleId: () => {
		return 'user';
	}
};

describe('Acl', () => {
	before(() => {
		acl = new Acl(user, user.getRoleId);
	});
	after(()=> {

	});

	it('should be initialised with user instance', () => {
		_.isEqual(acl.getUser(), user).should.be.eql(true);
	});
	it('should be possible to retrieve user role id', () => {
		acl.getUserRoleId().should.be.eql('user');
	});
	it('should throw error when provided parameter to retrieve user role id is not a function', () => {
		acl.setUserGetRoleIdFunc.bind(acl, {}).should.throw(Error);
	});
	it('should use chaning when adding a new role', () => {
		acl.addRole(new Role('anonyme')).constructor.name.should.be.eql('Acl');
	});
	it('should throw an error when trying to add a role that is not an instance of Role', () => {
		acl.addRole.bind(acl, {}).should.throw(Error);
	});
	it('should be possible to retrieve an added Role', () => {
		acl.getRole('anonyme').getId().should.eql('anonyme');
	});
	it('should be possible to delete a Role', () => {
		acl.removeRole('anonyme');
		should(acl.getRole('anonyme')).be.null;
	});
});
