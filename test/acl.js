import assert from 'assert';
import should from 'should';
import sinon from 'sinon';
import _ from 'lodash';
import {Acl, Role, Resource} from '../dist';

let acl;

describe('Acl', () => {
	before(() => {
		acl = new Acl();
	});
	after(()=> {
		Role._reset();
		Resource._reset();
	});

	it('should be initialised with no parameters', () => {
		(() => new Acl()).should.not.throw();
	});
	it('role Id and resource Id must be empty if no fetch Ids functions are passed in constructor ', () => {
		let fakeAcl = new Acl();
		fakeAcl._getRoleIdFunc({roleId: 'user'}).should.be.eql('');
		fakeAcl._getResourceIdFunc({resourceId: 'table'}).should.be.eql('');
	});
	it('role Id must be retrieved as specified in roleIdFetchFunc', () => {
		let fakeAcl = new Acl((user)=>user.roleId);
		fakeAcl._getRoleIdFunc({roleId: 'user'}).should.be.eql('user');
		fakeAcl._getResourceIdFunc({resourceId: 'table'}).should.be.eql('');
	});
	it('should build permissions as expected', ()=> {
		let fakeAcl = new Acl();
		fakeAcl.addRole(new Role('anonyme'));
		fakeAcl.addRole(new Role('user', ['anonyme']));
		fakeAcl.addResource(new Resource('row1', ['get', 'post']));
		fakeAcl.addResource(new Resource('row2'));
		fakeAcl.build();
		let permissions = fakeAcl.permissions;
		permissions.should.have.keys(['anonyme', 'user']);

		for (let roleId of Object.keys(permissions)) {
			permissions[roleId].should.have.keys(['row1', 'row2']);
			permissions[roleId]['row1'].should.have.keys(['*', 'get', 'post']);
			permissions[roleId]['row2'].should.have.keys(['*']);
			for (let resourceId of Object.keys(permissions[roleId])) {
				for (let privilege of Object.keys(permissions[roleId][resourceId])) {
					permissions[roleId][resourceId][privilege].should.be.eql({allowed: false, condition: null});
				}
			}
		}


	});

	describe('Roles', () => {
		before(() => {
			acl = new Acl();
		});
		after(()=> {
			acl = new Acl();
		});

		it('should use chaning when adding a new role', () => {
			acl.addRole(new Role('anonyme')).constructor.name.should.be.eql('Acl');
			acl.roles.should.containEql('anonyme');
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
			acl.roles.should.not.containEql('anonyme');
		});
	});

	describe('Resources', () => {
		before(() => {
			acl = new Acl();
		});
		after(()=> {
			acl = new Acl();
		});
		it('should be possible to add & retrieve a resource', ()=> {
			acl.addResource(new Resource('table0'));
			acl.resources.should.containEql('table0');
			let resource = acl.getResource('table0');
			resource.constructor.name.should.be.eql('Resource');
			resource.getId().should.be.eql('table0');
		});
		it('should be possible to remove an added resource by its id', ()=> {
			acl.removeResource('table0');
			should(acl.getResource('table0')).be.null;
			acl.resources.should.not.containEql('table0');
		});
	});


});
