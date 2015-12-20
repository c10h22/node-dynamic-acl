import assert from 'assert';
import should from 'should';
import sinon from 'sinon';
import {Resource} from '../dist';

describe('Resource', () => {
	var resource0;
	var resource1;
	var resource2;
	before(() => {
		resource0 = new Resource('table0');
		resource1 = new Resource('table1', ['get', 'post']);
		resource2 = new Resource('table2', ['get', 'post', '*']);
	});


	it('should be possible to add a new Resource identified only by its id', () => {
		resource0.constructor.name.should.be.eql('Resource');
		resource0.getId().should.be.eql('table0');
		resource0.getPrivileges().should.be.an.Array();
	});
	it('should have access privileges identified by an array of strings', ()=> {
		resource0.getPrivileges().should.be.an.Array();
		resource1.getPrivileges().should.be.an.Array();
		resource2.getPrivileges().should.be.an.Array();

		for (let privilege of resource0.getPrivileges()) {
			privilege.should.be.String();
		}
		for (let privilege of resource1.getPrivileges()) {
			privilege.should.be.String();
		}
		for (let privilege of resource2.getPrivileges()) {
			privilege.should.be.String();
		}
	});
	it('should automatically add * privilege', ()=> {
		resource0.getPrivileges().should.be.an.Array().and.containDeep(['*']).and.length(1);
		resource1.getPrivileges().should.be.an.Array().and.containDeep(['get', 'post', '*']).and.length(3);
		resource2.getPrivileges().should.be.an.Array().and.containDeep(['get', 'post', '*']).and.length(3);
	});
	it('should not be possible to remove * access privilege', ()=> {
		resource0.removePrivilege.bind(resource0, '*').should.throw(Error);
		resource1.removePrivilege.bind(resource1, '*').should.throw(Error);
		resource2.removePrivilege.bind(resource2, '*').should.throw(Error);
	});
	it('should not throw an error when trying to remove a privilege that does not exist', () => {
		resource0.removePrivilege.bind(resource0, 'delete').should.not.throw();
		resource1.removePrivilege.bind(resource1, 'delete').should.not.throw();
		resource2.removePrivilege.bind(resource2, 'delete').should.not.throw();
	});
	it('should be possible to remove an access privilege from a resource', ()=> {
		resource1.removePrivilege.bind(resource1, 'get').should.not.throw();
		resource1.getPrivileges().should.containDeep(['post', '*']).and.length(2);

		resource2.removePrivilege.bind(resource2, 'get').should.not.throw();
		resource2.getPrivileges().should.containDeep(['post', '*']).and.length(2);
	});
	it('should be possible to add an access privilege', ()=> {
		resource1.addPrivilege.bind(resource1, 'patch').should.not.throw(Error);
		resource1.getPrivileges().should.containDeep(['patch', 'post', '*']).and.length(3);

		resource2.addPrivilege.bind(resource2, 'patch').should.not.throw(Error);
		resource2.getPrivileges().should.containDeep(['patch', 'post', '*']).and.length(3);
	});
	it('should be possible to reset access privileges', () => {
		resource0.setPrivileges.bind(resource0, ['patch', 'post']).should.not.throw(Error);
		resource0.getPrivileges().should.containDeep(['patch', 'post', '*']).and.length(3);
	});

});
