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

	});

	it('should be initialised with no parameters', () => {
		(() => new Acl()).should.not.throw();
	});
	it('role Id and resource Id must be empty if no fetch Ids functions are passed in constructor ', () => {
		let fakeAcl = new Acl();
		fakeAcl._getRoleIdFunc({roleId: 'user'}).should.be.a.Promise;
		fakeAcl._getResourceIdFunc({resourceId: 'table'}).should.be.a.Promise;
		fakeAcl._getRoleIdFunc({roleId: 'user'}).should.be.finally.equal('');
		fakeAcl._getRoleIdFunc({roleId: 'user'}).should.be.finally.equal('');
	});
	it('role Id must be retrieved as specified in roleIdFetchFunc', () => {
		let fakeAcl = new Acl(
			(user) => new Promise(resolve => resolve(user.roleId))
		);
		fakeAcl._getRoleIdFunc({roleId: 'user'}).should.be.a.Promise;
		fakeAcl._getResourceIdFunc({resourceId: 'table'}).should.be.a.Promise;
		fakeAcl._getRoleIdFunc({roleId: 'user'}).should.be.finally.equal('user');
		fakeAcl._getResourceIdFunc({resourceId: 'table'}).should.be.finally.equal('');
	});

	it('resource Id must be retrieved as specified in resourceIdFetchFunc', () => {
		let fakeAcl = new Acl(
			(user) => new Promise(resolve => resolve(user.roleId)),
			(resource) => new Promise(resolve => resolve(user.resourceId))
		);
		fakeAcl._getRoleIdFunc({roleId: 'user'}).should.be.a.Promise;
		fakeAcl._getResourceIdFunc({resourceId: 'table'}).should.be.a.Promise;
		fakeAcl._getRoleIdFunc({roleId: 'user'}).should.be.finally.equal('user');
		fakeAcl._getResourceIdFunc({resourceId: 'table'}).should.be.finally.equal('table');
	});

	it('should throw error if trying to set an non function as ResourceIdFetchFunc', () => {
		let fakeAcl = new Acl(
			(user) => new Promise(resolve => resolve(user.roleId)),
			(resource) => new Promise(resolve => resolve(user.resourceId))
		);
		fakeAcl.setResourceIdFetchFunc.bind(fakeAcl,{}).should.throw(Error);
	});
	describe('Permissions', () => {

		let fakeAcl = new Acl();
		it('should build permissions as expected', ()=> {
			fakeAcl.addRole('anonyme');
			fakeAcl.addRole('user', ['anonyme']);
			fakeAcl.addResource(new Resource('row1', ['get', 'post']));
			fakeAcl.addResource(new Resource('row2'));
			fakeAcl.build();
			let permissions = fakeAcl.permissions;
			permissions.should.have.properties(['anonyme', 'user']);

			for (let roleId of Object.keys(permissions)) {
				permissions[roleId].should.have.properties(['row1', 'row2']);
				permissions[roleId]['row1'].should.have.properties(['*', 'get', 'post']);
				permissions[roleId]['row2'].should.have.properties(['*']);
				for (let resourceId of Object.keys(permissions[roleId])) {
					for (let privilege of Object.keys(permissions[roleId][resourceId])) {
						permissions[roleId][resourceId][privilege].should.be.eql({allowed: null, condition: null});
					}
				}
			}


		});

		it('should throw error when try to allow/deny a role/resource/privilege that does not exist or a non func condition', ()=> {
			fakeAcl.allow.bind(fakeAcl, 'admin', 'row3', 'patch', {a: 1}).should.throw(Error);
			fakeAcl.allow.bind(fakeAcl, 'user', 'row3', 'patch', {a: 1}).should.throw(Error);
			fakeAcl.allow.bind(fakeAcl, 'user', 'row1', 'patch', {a: 1}).should.throw(Error);
			fakeAcl.allow.bind(fakeAcl, 'user', 'row1', 'get', {a: 1}).should.throw(Error);


			fakeAcl.deny.bind(fakeAcl, 'admin', 'row3', 'patch', {a: 1}).should.throw(Error);
			fakeAcl.deny.bind(fakeAcl, 'user', 'row3', 'patch', {a: 1}).should.throw(Error);
			fakeAcl.deny.bind(fakeAcl, 'user', 'row1', 'patch', {a: 1}).should.throw(Error);
			fakeAcl.deny.bind(fakeAcl, 'user', 'row1', 'get', {a: 1}).should.throw(Error);


			fakeAcl.allow.bind(fakeAcl, 'anonyme', 'row1', 'get', function () {
				return Promise.resolve();
			}).should.not.throw(Error);


		});
		it('should be possible to allow or deny an array of privilege for a given resource', () => {
			let fakeAcl = new Acl();
			fakeAcl.addRole('anonyme');
			fakeAcl.addRole('user', ['anonyme']);
			fakeAcl.addResource(new Resource('row1', ['get', 'post']));
			fakeAcl.addResource(new Resource('row2'));
			fakeAcl.build();

			fakeAcl.allow.bind(fakeAcl, 'anonyme', 'row1', ['get', 'post'], function () {
				return Promise.resolve();
			}).should.not.throw(Error);
			fakeAcl.permissions['anonyme']['row1']['post'].should.be.containEql({allowed: true});
			fakeAcl.permissions['anonyme']['row1']['post'].condition().should.be.a.Promise;

			fakeAcl.deny.bind(fakeAcl, 'anonyme', 'row1', ['post', 'get']).should.not.throw(Error);
			fakeAcl.permissions['anonyme']['row1']['post'].should.be.containEql({allowed: false});


		});
		it('should allow only given permissions', () => {
			fakeAcl.permissions['anonyme']['row1']['get'].should.be.containEql({allowed: true});
			fakeAcl.permissions['anonyme']['row1']['get'].condition().should.be.a.Promise;
			fakeAcl.permissions['anonyme']['row1']['get'].condition().should.be.fulfilled();

			fakeAcl.permissions['anonyme']['row1']['post'].should.be.eql({allowed: null, condition: null});
			fakeAcl.permissions['anonyme']['row1']['*'].should.be.eql({allowed: null, condition: null});
			fakeAcl.isRoleAllowed('anonyme', 'row1', 'get').should.be.a.Promise;
			fakeAcl.isRoleAllowed('anonyme', 'row1', 'get').should.be.fulfilled();
			fakeAcl.isAnyParentAllowed('user', 'row1', 'get').should.be.a.Promise;
			fakeAcl.isAnyParentAllowed('user', 'row1', 'get').should.be.fulfilled();
		});

		it('should deny only given permissions', () => {
			fakeAcl.deny('anonyme', 'row1', 'post');

			fakeAcl.permissions['anonyme']['row1']['post'].should.be.containEql({allowed: false});
			should(fakeAcl.permissions['anonyme']['row1']['post'].condition).be.null;

			fakeAcl.isRoleAllowed('anonyme', 'row1', 'post').should.be.a.Promise;
			fakeAcl.isRoleAllowed('anonyme', 'row1', 'post').should.be.a.rejected();

			fakeAcl.permissions['anonyme']['row1']['*'].should.be.eql({allowed: null, condition: null});
		});

		it('children must be independent form parent if a specific rule is applied', ()=> {
			fakeAcl.allow('user', 'row1', 'post');
			fakeAcl.permissions['user']['row1']['post'].should.be.containEql({allowed: true});
			fakeAcl.isRoleAllowed('user', 'row1', 'post').should.be.fulfilled();
		});

		it('children must be inherit form parent if no specific rule is applied', () => {
			fakeAcl.permissions['user']['row1']['get'].should.be.containEql({allowed: null});
			fakeAcl.isRoleAllowed('user', 'row1', 'get').should.be.fulfilled();
		});

		it('should deny all privileges if not specified', () => {
			fakeAcl.deny('anonyme', 'row1');
			fakeAcl.permissions['anonyme']['row1']['get'].should.be.containEql({allowed: false});
			fakeAcl.permissions['anonyme']['row1']['post'].should.be.containEql({allowed: false});
			fakeAcl.permissions['anonyme']['row1']['*'].should.be.containEql({allowed: false});

			fakeAcl.isRoleAllowed('anonyme', 'row1', 'get').should.be.rejected();
			fakeAcl.isRoleAllowed('anonyme', 'row1', 'post').should.be.rejected();
			fakeAcl.isRoleAllowed('anonyme', 'row1', '*').should.be.rejected();
			fakeAcl.isRoleAllowed('anonyme', 'row1').should.be.rejected();
		});
		it('should allow all privileges if not specified', () => {
			fakeAcl.allow('anonyme', 'row1');
			fakeAcl.permissions['anonyme']['row1']['get'].should.be.containEql({allowed: true});
			fakeAcl.permissions['anonyme']['row1']['post'].should.be.containEql({allowed: true});
			fakeAcl.permissions['anonyme']['row1']['*'].should.be.containEql({allowed: true});

			fakeAcl.isRoleAllowed('anonyme', 'row1', 'get').should.be.fulfilled();
			fakeAcl.isRoleAllowed('anonyme', 'row1', 'post').should.be.fulfilled();
			fakeAcl.isRoleAllowed('anonyme', 'row1', '*').should.be.fulfilled();
			fakeAcl.isRoleAllowed('anonyme', 'row1').should.be.fulfilled();
		});
		it('should look to * privilege if privilege does not exist', () => {
			fakeAcl.isRoleAllowed('anonyme', 'row1', 'create').should.be.fulfilled();
			fakeAcl.deny('anonyme', 'row1');
			fakeAcl.isRoleAllowed('anonyme', 'row1', 'create').should.be.rejected();
		});
		it('should use conditional access if specified', () => {
			fakeAcl.setResourceIdFetchFunc((resource) => new Promise(resolve => resolve(resource.id)));
			fakeAcl.setRoleIdFetchFunc((user) => new Promise(resolve => resolve(user.role)));

			let user = {role: 'anonyme'};
			let resource = {id: 'row1'};

			fakeAcl.allow('anonyme', 'row1', 'get', () => Promise.resolve());
			fakeAcl.isAllowed(user, resource, 'get').should.be.fulfilled();
			fakeAcl.allow('anonyme', 'row1', 'get', () => Promise.reject());
			fakeAcl.isAllowed(user, resource, 'get').should.be.rejected();
		});
	});
	describe('Roles', () => {
		before(() => {
			acl = new Acl();
		});

		it('should use chaning when adding a new role', () => {
			acl.addRole('anonyme').constructor.name.should.be.eql('Acl');
			acl.roles.map((role)=>role.getId()).should.containEql('anonyme');
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
			acl.resources.map((resource)=>resource.getId()).should.containEql('table0');
			let resource = acl.getResource('table0');
			resource.constructor.name.should.be.eql('Resource');
			resource.getId().should.be.eql('table0');
		});
		it('should be possible to remove an added resource by its id', ()=> {
			acl.removeResource('table0');
			should(acl.getResource('table0')).be.null;
			acl.resources.map((resource)=>resource.getId()).should.not.containEql('table0');
		});
	});


});
