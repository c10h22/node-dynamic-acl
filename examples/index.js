const { Acl, Role, Resource } = require('../dist/');

// Define how we retrieve user role id
const getUserRoleId = async user => (user.roleId ? user.roleId : 'visitor');
// Define how we retrieve resource id
const getResourceId = async resource => resource.resourceId;
// Create ACL instance
const acl = new Acl(getUserRoleId, getResourceId);

acl.addRole('visitor')
  .addRole(new Role('user', ['visitor'], acl))
  .addRole('admin', ['user'])
  .addResource(new Resource('book'))
  .addResource(new Resource('page', ['read', 'write', 'update', 'delete']))
  .build();

// Allow visitor(Role) to read(Permission) Page (Resource)
acl.allow('visitor', 'page', 'read');
// Allow user(Role) to write(Permission) Page(Resource)
acl.allow('user', 'page', 'write');

// Define dynamic authorisation depending on user and resource
const userCanUpdatePage = async (user, page) => {
  if (user.id === 1 && page.id === 'page 1') {
    return Promise.resolve();
  }
  return Promise.reject();
};
// user(Role) will have update(Permission) on page(Resource) if and only if userCanUpdatePage
// is fulfilled
acl.allow('user', 'page', 'update', userCanUpdatePage);
// user(Role) will not have to right to delete(Permission) page (Resource)
acl.deny('user', 'page', 'delete');
// Give admin(Role) all Permissions on page and book (Resources)
acl.allow('admin', 'page')
  .allow('admin', 'book');

const anonymousUser = {};

const loggedUser = {
  id: 1,
  roleId: 'user',
};
const adminUser = {
  id: 2,
  roleId: 'admin',
};

const page1Resource = {
  resourceId: 'page',
  id: 'page 1',
};

const page2Resource = {
  resourceId: 'page',
  id: 'page 2',
};

const bookResource = {
  resourceId: 'book',
};

acl.isAllowed(anonymousUser, page1Resource, 'read').then(
  () => console.log('anonymousUser is allowed to read page1Resource'),
  () => console.log('anonymousUser has been denied to read page1Resource'),
);

acl.isAllowed(anonymousUser, page1Resource, 'write').then(
  () => console.log('anonymousUser is allowed to write page1Resource'),
  () => console.log('anonymousUser has been denied to write page1Resource'),
);

acl.isAllowed(loggedUser, page1Resource, 'read').then(
  () => console.log('loggedUser is allowed to read page1Resource'),
  () => console.log('loggedUser has been denied to read page1Resource'),
);

acl.isAllowed(loggedUser, page1Resource, 'write').then(
  () => console.log('loggedUser is allowed to write page1Resource'),
  () => console.log('loggedUser has been denied to write page1Resource'),
);

acl.isAllowed(loggedUser, page1Resource, 'update').then(
  () => console.log('loggedUser is allowed to update page1Resource'),
  () => console.log('loggedUser has been denied to update page1Resource'),
);
acl.isAllowed(loggedUser, page2Resource, 'update').then(
  () => console.log('loggedUser is allowed to update page2Resource'),
  () => console.log('loggedUser has been denied to update pag2Resource'),
);
acl.isAllowed(loggedUser, page1Resource, 'delete').then(
  () => console.log('loggedUser is allowed to delete page1Resource'),
  () => console.log('loggedUser has been denied to delete pag1Resource'),
);
acl.isAllowed(adminUser, page1Resource, 'delete').then(
  () => console.log('adminUser is allowed to delete page1Resource'),
  () => console.log('adminUser has been denied to delete pag1Resource'),
);

acl.isAllowed(adminUser, bookResource, 'newPermission').then(
  () => console.log('adminUser is allowed to do anything to bookResource'),
  () => console.log('adminUser has been denied inexistante privilege on bookResource'),
);
