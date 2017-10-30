import should from 'should';
import { Role, Acl } from '../dist';

describe('Roles', () => {
  let acl;
  beforeEach((done) => {
    acl = new Acl();
    done();
  });

  it('should be declared using only an id', () => {
    (roleId => new Role(roleId)).bind(null, 'user').should.not.throw();
  });

  it('should throw an error if declared using id, parents and without acl', () => {
    ((roleId, parents) => new Role(roleId, parents)).bind(null, 'user', ['anonymous']).should.throw(Error);
  });

  it('should not throw an error if declared using id, parents and acl', () => {
    const anonymous = new Role('anonymous');
    const instance = acl.addRole(anonymous);
    instance.should.be.instanceof(Acl);
    //(() => new Role('user', ['anonymous'], acl)).bind(null, 'user', ['anonymous'], acl).should.not.throw();
    (() => new Role('user', [anonymous], acl)).bind().should.not.throw();
  });

  it('should be possible to set a list of parents', () => {
    const anonymous1 = new Role('anonymous1');
    const anonymous2 = new Role('anonymous2');

    acl.addRole(anonymous1).addRole(anonymous2);

    const user = new Role('user', ['anonymous1'], acl);
    acl.addRole(user);
    user.setParents(['anonymous2']).getParent('anonymous2').should.be.an.instanceof(Role);
    user.getParents().should.be.length(1);
  });
  it('should be possible to add a parent by its id', () => {
    const anonymous = new Role('anonymous');
    const user = new Role('user');
    acl.addRole(anonymous).addRole(user);
    user.addParent('anonymous').getParent('anonymous').should.be.an.instanceof(Role);
  });
  it('should be possible to add a parent by its instance', () => {
    const anonymous = new Role('anonymous');
    const user = new Role('user');
    acl.addRole(anonymous).addRole(user);
    user.addParent(anonymous);
    user.getParent('anonymous').should.be.an.instanceof(Role);
  });
  it('should be possible to add a list of parents', () => {
    const anonymous = new Role('anonymous');
    const user = new Role('user');
    const admin = new Role('admin');
    acl.addRole(anonymous).addRole(user).addRole(admin);
    admin.addParents(['anonymous', 'user']);
    admin.getParent('user').should.be.an.instanceof(Role);
    admin.getParent('user').getId().should.be.eql('user');
    admin.getParent('anonymous').should.be.an.instanceof(Role);
    admin.getParent('anonymous').getId().should.be.eql('anonymous');
  });
  it('should be possible to remove a parent', () => {
    const anonymous = new Role('anonymous');
    const user = new Role('user');
    const admin = new Role('admin');
    acl.addRole(anonymous).addRole(user).addRole(admin);
    admin.addParents(['anonymous', 'user']);
    admin.removeParent('anonymous');
    should(admin.getParent('anonymous')).be.null;
    admin.getParent('user').should.be.instanceof(Role);
  });
  it('should be possible to remove a list of parents', () => {
    const anonymous = new Role('anonymous');
    const user = new Role('user');
    const admin = new Role('admin');
    acl.addRole(anonymous).addRole(user).addRole(admin);
    admin.addParents(['anonymous', 'user']);
    admin.removeParents(['anonymous', 'user']);
    admin.getParents().should.be.length(0);
  });
});
