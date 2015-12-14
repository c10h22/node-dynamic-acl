import assert from 'assert';
import should from 'should';
import sinon from 'sinon';
import {Role} from '../dist';

describe('Roles', () => {
	before(() => {
		Role._add(new Role('anonymous'));
		Role._add(new Role({id: 'user', parents: ['anonymous']}));
		Role._add(new Role('supervisor', 'user'));
	});
	after(()=> {
		for (let role of Object.keys(Role.ids)) {
			Role._remove(role);
		}
	});

	it('should contains all previous added roles', () => {
		Role.ids.should.have.keys('anonymous', 'user', 'supervisor');
		Role._get('anonymous').should.be.an.instanceof(Role);
		Role._get('user').should.be.an.instanceof(Role);
		Role._get('supervisor').should.be.an.instanceof(Role);
	});
	it('created without parents should have an empty parents array', () => {
		Role._get('anonymous').getParents().should.be.Array().which.length(0);
	});

	it('created with one or more parents should have their parent id in an array', () => {
		Role._get('user').getParents().should.be.Array().which.length(1);
		Role._get('user').getParent('anonymous').constructor.name.should.be.eql('Role');
		Role._get('user').getParent('anonymous').getId().should.be.eql('anonymous');

		Role._get('supervisor').getParents().should.be.Array().which.length(1);
		Role._get('supervisor').getParent('user').constructor.name.should.be.eql('Role');
		Role._get('supervisor').getParent('user').getId().should.be.eql('user');
	});
	it('can\'t have undeclared parent, only declared roles can be used as parent', () => {
		((opts)=> Role._add(new Role(opts))).bind(null, {id: 'admin', parents: ['undeclared']}).should.throw(Error);
		((opts)=> Role._add(new Role(opts))).bind(null, {id: 'admin', parents: ['user']}).should.not.throw();
	});
	it('can be created with an array of parent roles', () => {
		Role._add(new Role({id: 'superadmin', parents: ['admin', 'user']}));
		Role._get('superadmin').getParents().should.be.an.Array().which.length(2);
	});
	it('can be created with a string of parent role', () => {
		Role._add(new Role({id: 'root', parents: 'superadmin'}));
		Role._get('root').getParents().should.be.an.Array().which.length(1);
	});
	it('can be removed without throwing error if role exists', () => {
		Role._remove.bind(null, 'superadmin').should.not.throw();
		Role.ids.should.not.have.properties('superadmin');
		should(Role._get('superadmin')).be.null;
	});

	it('parents must be refreshed when parent role is removed', () => {
		Role._get('root').getParents().should.be.an.Array().which.length(0);
	});
	it('additions/removals should be chained', () => {
		Role._add(new Role('superadmin')).constructor.name.should.be.eql('Role');
		let instance = Role._get('superadmin').addParents(['anonymous', 'user', 'admin']);
		instance.constructor.name.should.be.eql('Role');
		instance.getId().should.be.eql('superadmin');
		instance = Role._get('superadmin').removeParents(['fake', 'admin']);
		instance.constructor.name.should.be.eql('Role');
		instance.getId().should.be.eql('superadmin');
	});
	it('can be added as a parent of another role', () => {
		Role._get('superadmin').getParents().map((parent) => parent.getId()).should.containDeep(['anonymous', 'user']);
	});

	it('can be removed from a child role', () => {
		Role._get('superadmin').getParents().map((parent) => parent.getId()).should.not.containDeep(['admin']);
	});

});
