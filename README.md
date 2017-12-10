# node-dynamic-acl
==========

Dynamic Access Control List for Node.js to fully control your Roles, Resources, Privileges and Conditions

## Install
```
$ npm install dynamic-acl
```
or using yarn:
```
$ yarn add dynamic-acl
```
## Quick Start

First you need to tell dynamic-acl how to retrieve:
* How it can retrieve User RoleID. As this function is asynchrone, it could be a database query for example. 
* How it can retrieve Resource ID. Same as for retrieving User RoleID, this is an asynchrone call. 
* Create new ACL instance using those two functions.
  

```javascript
const { Acl, Role, Resource } = require('dynamic-acl');

// Define how we retrieve user role id
const getUserRoleId = async user => user.roleId ? user.roleId : 'visitor';
// Define how we retrieve resource id
const getResourceId = async resource => resource.resourceId;
// Create ACL instance
const acl = new Acl(getUserRoleId, getResourceId);

```
* Add differents Roles to ACL.

```javascript
// Add new Role using string identifier
acl.addRole('visitor');
```
is equivalent to: 
```javascript
// Add new Role instance
acl.addRole(new Role('visitor'));
```
Roles can inherit from each others in a parent-child fashion:

```javascript
// Add parent role
acl.addRole('visitor');
// Add child role
acl.addRole(new Role('user', ['visitor'], acl))
```
* Add differents Resources to ACL.

```javascript
// Add Book Resource without permissions
acl.addResource(new Resource('book'))
```
```javascript
// Add Page Resource with permissions: read, mark and change title
acl.addResource(new Resource('page', ['read', 'write', 'delete', 'update']))
```
* Build ACL definition.

```javascript
acl.build();
```

`addRole` and `addRole` functions are chainable so you can chain them all.

```javascript
acl.addRole('visitor')
  .addRole(new Role('user', ['visitor']))
  .addRole('admin', ['user'])
  .addResource(new Resource('book'))
  .addResource(new Resource('page', ['read', 'write', 'update', 'delete']))
  .build();
```

* Set authorizations

```javascript
// Allow visitor(Role) to read(Permission) Page (Resource)
acl.allow('visitor', 'page', 'read');
```

```javascript
// Allow user(Role) to write(Permission) Page(Resource)
acl.allow('user', 'page', 'write');
```
**N.B**: As `user` Role inherits permissions from `visitor` Role, `user` will also have `read` Permission on `page` Resource 

Permission could also be defined by an async call to database or cache server for example to determine if Role has the required permission:

```javascript
// Define dynamic authorisation depending on user and resource
const userCanUpdatePage = async (user, page) => {
  if(user.id === 1 && page.id === 'page 1') {
    return Promise.resolve();
  }
  return Promise.reject();
};
// user(Role) will have update(Permission) on page(Resource) if and only if userCanUpdatePage is fulfilled
acl.allow('user', 'page', 'update', userCanUpdatePage)
```

As you allowed some Roles to have Permissions on some Resources, you can also **deny** other Permissions

```javascript
// user(Role) will not have to right to delete(Permission) page (Resource)
acl.deny('user', 'page', 'delete');
```

You can also give all Permissions privileges to a Role
```javascript
// Give admin(Role) all Permissions on page and book (Resources)
acl.allow('admin', 'page')
   .allow('admin', 'book');
```

* Check Permissions upon a Role and Resource

```javascript
acl.isAllowed(anonymousUser, page1Resource, 'read').then(
  () => console.log('anonymousUser is allowed to read page1Resource'),
  () => console.log('anonymousUser has been denied to read page1Resource'),
);

acl.isAllowed(adminUser, bookResource, 'newPermission').then(
  () => console.log('adminUser is allowed to do anything to bookResource'),
  () => console.log('adminUser has been denied inexistante privilege on bookResource'),
);
// See example file for complete list of tests
```
outputs:
```
anonymousUser is allowed to read page1Resource
loggedUser is allowed to write page1Resource
adminUser is allowed to delete page1Resource
adminUser is allowed to do anything to bookResource
anonymousUser has been denied to write page1Resource
loggedUser is allowed to update page1Resource
loggedUser has been denied to delete pag1Resource
loggedUser is allowed to read page1Resource
loggedUser has been denied to update pag2Resource

```

## Debug

Use the following command to view debug messages  
```$ DEBUG=node-dynamic-acl:* node example.js``` 

## API Reference

## License

Copyright (c) 2016

Licensed under the [MIT license](LICENSE).
