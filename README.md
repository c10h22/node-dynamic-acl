node-dynamic-acl
==========

Dynamic Access Control List for Node.js to fully control your Roles, Resources, Privileges and Conditions

#Install
```
$ npm install dynamic-acl
```

#Quick Start

```javascript
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
console.log('anonymous isAllowed book:sell ' + acl.isAllowed(anonymous, book, 'sell')); //false            //privilege was not declared previously -> inherit from book:*

console.log('---user permissions check---');
console.log('bob isAllowed page1:* ' + acl.isAllowed(bob, page1)); //true
console.log('bob isAllowed page1:read ' + acl.isAllowed(bob, page1, 'read')); //true
console.log('bob isAllowed page1:mark ' + acl.isAllowed(bob, page1, 'mark')); //false
console.log('bob isAllowed page1:change title ' + acl.isAllowed(bob, page1, 'change title')); //false
console.log('bob isAllowed book:* ' + acl.isAllowed(bob, book)); //false
console.log('bob isAllowed book:sell ' + acl.isAllowed(bob, book, 'sell')); //false            //privilege was not declared previously -> inherit from book:*

console.log('---admin permissions check---');
console.log('me isAllowed page1:* ' + acl.isAllowed(me, page1)); //true
console.log('me isAllowed page1:read ' + acl.isAllowed(me, page1, 'read')); //true
console.log('me isAllowed page1:mark ' + acl.isAllowed(me, page1, 'mark')); //true
console.log('me isAllowed page1:change title ' + acl.isAllowed(me, page1, 'change title')); //true
console.log('me isAllowed book:* ' + acl.isAllowed(me, book)); // true
console.log('me isAllowed book:sell ' + acl.isAllowed(me, book, 'sell'));//true            //privilege was not declared previously -> inherit from book:*


```

#API Reference
	<a name="Acl"></a>
## Acl
This class holds all information about Roles, Resources and Permissions

**Kind**: global class  

* [Acl](#Acl)
    * [new Acl(roleIdFetchFunc, resourceIdFetchFunc)](#new_Acl_new)
    * [.setRoleIdFetchFunc(func)](#Acl+setRoleIdFetchFunc) ⇒ <code>[Acl](#Acl)</code>
    * [.setResourceIdFetchFunc(func)](#Acl+setResourceIdFetchFunc) ⇒ <code>[Acl](#Acl)</code>
    * [.addRole(role, Parents)](#Acl+addRole) ⇒ <code>[Acl](#Acl)</code>
    * [.removeRole(role)](#Acl+removeRole) ⇒ <code>[Acl](#Acl)</code>
    * [.getRole(id)](#Acl+getRole) ⇒ <code>[Role](#Role)</code>
    * [.addResource(resource)](#Acl+addResource) ⇒ <code>[Acl](#Acl)</code>
    * [.removeResource(resource)](#Acl+removeResource) ⇒ <code>[Acl](#Acl)</code>
    * [.getResource(id)](#Acl+getResource) ⇒ <code>[Resource](#Resource)</code> &#124; <code>null</code>
    * [.build()](#Acl+build) ⇒ <code>[Acl](#Acl)</code>
    * [.allow(roleId, resourceId, privilege, condition)](#Acl+allow) ⇒ <code>[Acl](#Acl)</code>
    * [.deny(roleId, resourceId, privilege, condition)](#Acl+deny) ⇒ <code>[Acl](#Acl)</code>
    * [._allowOrDeny(allow, roleId, resourceId, privilege, condition)](#Acl+_allowOrDeny)
    * [.isAllowed(user, resource, privilege)](#Acl+isAllowed) ⇒ <code>Promise</code>
    * [.isRoleAllowed(roleId, resourceId, privilege)](#Acl+isRoleAllowed) ⇒ <code>Promise</code>
    * [.isAnyParentAllowed(roleId, resourceId, privilege)](#Acl+isAnyParentAllowed) ⇒ <code>Promise</code>
    * [.getPermissions(roleId)](#Acl+getPermissions) ⇒ <code>Array.&lt;Object&gt;</code>

<a name="new_Acl_new"></a>
### new Acl(roleIdFetchFunc, resourceIdFetchFunc)
Constructor


| Param | Type | Description |
| --- | --- | --- |
| roleIdFetchFunc | <code>[fetchRoleIdFunc](#fetchRoleIdFunc)</code> | function that will let Acl fetch Role id (default will return empty string) |
| resourceIdFetchFunc | <code>[fetchResourceIdFunc](#fetchResourceIdFunc)</code> | function that will let Acl fetch Resource id (default will return empty string) |

**Example**  
```js
var myAcl = new Acl(function(user){
		return Promise.resolve(user.getRole());
}, function(resource){
		return Promise.resolve(resource.getResourceId());
});
```
<a name="Acl+setRoleIdFetchFunc"></a>
### acl.setRoleIdFetchFunc(func) ⇒ <code>[Acl](#Acl)</code>
Sets how Acl should retrieve Role Id

**Kind**: instance method of <code>[Acl](#Acl)</code>  
**Returns**: <code>[Acl](#Acl)</code> - this instance for chaining  

| Param | Type | Description |
| --- | --- | --- |
| func | <code>[fetchRoleIdFunc](#fetchRoleIdFunc)</code> | that will let Acl fetch Role Id from an object that may have a role |

<a name="Acl+setResourceIdFetchFunc"></a>
### acl.setResourceIdFetchFunc(func) ⇒ <code>[Acl](#Acl)</code>
Sets how Acl should retrieve Resource Id

**Kind**: instance method of <code>[Acl](#Acl)</code>  
**Returns**: <code>[Acl](#Acl)</code> - this instance for chaining  

| Param | Type | Description |
| --- | --- | --- |
| func | <code>[fetchResourceIdFunc](#fetchResourceIdFunc)</code> | that will let Acl fetch Resource Id from an object that may be a resource |

<a name="Acl+addRole"></a>
### acl.addRole(role, Parents) ⇒ <code>[Acl](#Acl)</code>
Add a new Role to Access Control List

**Kind**: instance method of <code>[Acl](#Acl)</code>  
**Returns**: <code>[Acl](#Acl)</code> - this instanc@e for chaining  
**Throws**:

- <code>Error</code> if role is not an instance of [Role](#Role) or a string


| Param | Type | Description |
| --- | --- | --- |
| role | <code>[Role](#Role)</code> &#124; <code>string</code> | instance to add |
| Parents | <code>Array.&lt;string&gt;</code> &#124; <code>[Array.&lt;Role&gt;](#Role)</code> | default is empty array |

**Example**  
```js
acl.addRole('anonyme');
acl.addRole('user', ['anonyme']);
acl.addRole(new Role('admin', ['user'], acl));
acl.addRole('super', [new Role('normal', [], acl)]);
```
<a name="Acl+removeRole"></a>
### acl.removeRole(role) ⇒ <code>[Acl](#Acl)</code>
Deletes role from the list of declared roles

**Kind**: instance method of <code>[Acl](#Acl)</code>  
**Returns**: <code>[Acl](#Acl)</code> - this instance for chaining  

| Param | Type |
| --- | --- |
| role | <code>[Role](#Role)</code> &#124; <code>string</code> | 

**Example**  
```js
acl.remove('anonymous');
```
<a name="Acl+getRole"></a>
### acl.getRole(id) ⇒ <code>[Role](#Role)</code>
Retrieve an instance of Role identified by id. It must be added before calling this function

**Kind**: instance method of <code>[Acl](#Acl)</code>  
**Returns**: <code>[Role](#Role)</code> - a Role instance if it was previously added or null if not exists  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | of Role to retrieve |

<a name="Acl+addResource"></a>
### acl.addResource(resource) ⇒ <code>[Acl](#Acl)</code>
Add a new resource to Access Control List

**Kind**: instance method of <code>[Acl](#Acl)</code>  
**Returns**: <code>[Acl](#Acl)</code> - this instance for chaining  
**Throws**:

- <code>Error</code> if resource is not an instance of [Acl](#Acl)


| Param | Type | Description |
| --- | --- | --- |
| resource | <code>[Resource](#Resource)</code> | to add to Access Control List |

**Example**  
```js
acl.addResource(new Resource('page'));
acl.addResource(new Resource('book', ['read', 'buy']);
```
<a name="Acl+removeResource"></a>
### acl.removeResource(resource) ⇒ <code>[Acl](#Acl)</code>
Removes a resource from Access Control List

**Kind**: instance method of <code>[Acl](#Acl)</code>  
**Returns**: <code>[Acl](#Acl)</code> - this instance for chaining  
**Throws**:

- <code>Error</code> if resource is not an instance of [Resource](#Resource) or of type string


| Param | Type | Description |
| --- | --- | --- |
| resource | <code>[Resource](#Resource)</code> &#124; <code>string</code> | to remove |

**Example**  
```js
acl.removeResource('page');
acl.removeResource(bookResourceInstance);
```
<a name="Acl+getResource"></a>
### acl.getResource(id) ⇒ <code>[Resource](#Resource)</code> &#124; <code>null</code>
Get resource instance by its Id if it was previously added to Access Control List

**Kind**: instance method of <code>[Acl](#Acl)</code>  
**Returns**: <code>[Resource](#Resource)</code> &#124; <code>null</code> - Resource instance if it exists. will return null otherwise  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> &#124; <code>[Resource](#Resource)</code> | of resource to get |

**Example**  
```js
acl.getResource('page');
```
<a name="Acl+build"></a>
### acl.build() ⇒ <code>[Acl](#Acl)</code>
Build all permissions based on added [Role](#Role) and [Resource](#Resource). Permissions are initialized
to allow = false and condition = null

**Kind**: instance method of <code>[Acl](#Acl)</code>  
**Returns**: <code>[Acl](#Acl)</code> - this instance for chaining  
<a name="Acl+allow"></a>
### acl.allow(roleId, resourceId, privilege, condition) ⇒ <code>[Acl](#Acl)</code>
Allow User with Role Id to access Privileged Resource (which have Resource Id) under condition

**Kind**: instance method of <code>[Acl](#Acl)</code>  
**Returns**: <code>[Acl](#Acl)</code> - this instance for chaining  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| roleId | <code>string</code> &#124; <code>[Role](#Role)</code> |  | Role Id or Role instance |
| resourceId | <code>string</code> &#124; <code>[Resource](#Resource)</code> |  | Resource Id or Resource instance |
| privilege | <code>string</code> &#124; <code>Array.&lt;string&gt;</code> | <code>&quot;*&quot;</code> | Privilege (default is '*' all) |
| condition | <code>[permissionConditionFunc](#permissionConditionFunc)</code> | <code></code> | Conditional permission function (default is null) |

**Example**  
```js
acl.allow('user', 'article', 'write')
   .allow('user', 'article', ['read', 'comment']);
   .allow('user', 'article', 'modify', function(user, blog){
		return user.id == article.author_id;
		});
```
<a name="Acl+deny"></a>
### acl.deny(roleId, resourceId, privilege, condition) ⇒ <code>[Acl](#Acl)</code>
Deny User with Role Id to access Privileged Resource (which have Resource Id) under condition

**Kind**: instance method of <code>[Acl](#Acl)</code>  
**Returns**: <code>[Acl](#Acl)</code> - this instance for chaining  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| roleId | <code>string</code> &#124; <code>[Role](#Role)</code> |  | Role Id or Role instance |
| resourceId | <code>string</code> &#124; <code>[Resource](#Resource)</code> |  | Resource Id or Resource instance |
| privilege | <code>string</code> &#124; <code>Array.&lt;string&gt;</code> | <code>&quot;*&quot;</code> | Privilege (default is '*' all) |
| condition | <code>[permissionConditionFunc](#permissionConditionFunc)</code> | <code></code> | Conditional permission function (default is null) |

**Example**  
```js
acl.deny('anonymous', 'article', 'write')
   .deny('anonymous', 'article', ['modify', 'comment'])
   .deny('anonymous', 'article', 'read', function(user, article){
		return article.is_public;
	  });
```
<a name="Acl+_allowOrDeny"></a>
### acl._allowOrDeny(allow, roleId, resourceId, privilege, condition)
Allow User with Role Id to access Privileged Resource (which have Resource Id) under condition

**Kind**: instance method of <code>[Acl](#Acl)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| allow | <code>boolean</code> |  | true = allowed, false = denied |
| roleId | <code>string</code> &#124; <code>[Role](#Role)</code> |  | Role Id or Role instance |
| resourceId | <code>string</code> &#124; <code>[Resource](#Resource)</code> |  | Resource Id or Resource instance |
| privilege | <code>string</code> | <code>&quot;*&quot;</code> | Privilege (default is '*' all) |
| condition | <code>[permissionConditionFunc](#permissionConditionFunc)</code> | <code></code> | Conditional permission function (default is null) |

<a name="Acl+isAllowed"></a>
### acl.isAllowed(user, resource, privilege) ⇒ <code>Promise</code>
Checks if user is allowed to access resource with a given privilege. If yes, it checks condition

**Kind**: instance method of <code>[Acl](#Acl)</code>  

| Param | Type | Default |
| --- | --- | --- |
| user | <code>\*</code> |  | 
| resource | <code>\*</code> |  | 
| privilege | <code>string</code> | <code>&quot;*&quot;</code> | 

**Example**  
```js
acl.isAllowed(userObject, resourceObject, 'read');
acl.isAllowed(userObject, resourceObject);
```
<a name="Acl+isRoleAllowed"></a>
### acl.isRoleAllowed(roleId, resourceId, privilege) ⇒ <code>Promise</code>
Checks if roleId has access to resourceId with privilege. If not, it will check if one of the related parents
has access to resource id

**Kind**: instance method of <code>[Acl](#Acl)</code>  

| Param | Type | Default |
| --- | --- | --- |
| roleId | <code>string</code> |  | 
| resourceId | <code>string</code> |  | 
| privilege | <code>string</code> | <code>&quot;*&quot;</code> | 

**Example**  
```js
acl.isRoleAllowed('user', 'book', 'read');
acl.isRoleAllow('user', 'page');
```
<a name="Acl+isAnyParentAllowed"></a>
### acl.isAnyParentAllowed(roleId, resourceId, privilege) ⇒ <code>Promise</code>
Checks if any role's parents is allowed to access resourceId with privileges

**Kind**: instance method of <code>[Acl](#Acl)</code>  

| Param | Type |
| --- | --- |
| roleId | <code>string</code> | 
| resourceId | <code>string</code> | 
| privilege | <code>string</code> | 

<a name="Acl+getPermissions"></a>
### acl.getPermissions(roleId) ⇒ <code>Array.&lt;Object&gt;</code>
Returns an object representing roleId permissions

**Kind**: instance method of <code>[Acl](#Acl)</code>  
**Returns**: <code>Array.&lt;Object&gt;</code> - Permissions for each resource  

| Param | Type |
| --- | --- |
| roleId | <code>string</code> &#124; <code>[Role](#Role)</code> | 

**Example**  
```js
acl.getPermissions('user');
```
	<a name="Role"></a>
## Role
Role class

**Kind**: global class  

* [Role](#Role)
    * [new Role(id, parents, acl)](#new_Role_new)
    * [.setAcl(acl)](#Role+setAcl)
    * [.getAcl()](#Role+getAcl) ⇒ <code>[Acl](#Acl)</code> &#124; <code>\*</code>
    * [.setId(id)](#Role+setId) ⇒ <code>[Role](#Role)</code>
    * [.getId()](#Role+getId) ⇒ <code>string</code>
    * [.setParents(parents)](#Role+setParents) ⇒ <code>[Role](#Role)</code>
    * [.getParents()](#Role+getParents) ⇒ <code>Array</code> &#124; <code>[Array.&lt;Role&gt;](#Role)</code>
    * [.getParent(role)](#Role+getParent) ⇒ <code>[Role](#Role)</code> &#124; <code>null</code>
    * [.addParent(role)](#Role+addParent) ⇒ <code>[Role](#Role)</code>
    * [.addParents(roles)](#Role+addParents) ⇒ <code>[Role](#Role)</code>
    * [.removeParent({Role|string)](#Role+removeParent) ⇒ <code>[Role](#Role)</code>
    * [.removeParents(roles)](#Role+removeParents) ⇒ <code>[Role](#Role)</code>
    * [.toString()](#Role+toString) ⇒ <code>string</code>

<a name="new_Role_new"></a>
### new Role(id, parents, acl)
Creates a new role and attach it to Acl

**Throws**:

- <code>Error</code> if acl is not an instance of {Acl} or given parents were not declared before


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| id | <code>string</code> |  | role's id |
| parents | <code>Array.&lt;string&gt;</code> &#124; <code>[Array.&lt;Role&gt;](#Role)</code> |  | list of parents |
| acl | <code>[Acl](#Acl)</code> | <code></code> | ACL to which this role will be attached |

<a name="Role+setAcl"></a>
### role.setAcl(acl)
Sets the ACL to which this role will be attached

**Kind**: instance method of <code>[Role](#Role)</code>  

| Param | Type |
| --- | --- |
| acl | <code>[Acl](#Acl)</code> | 

<a name="Role+getAcl"></a>
### role.getAcl() ⇒ <code>[Acl](#Acl)</code> &#124; <code>\*</code>
Returns the ACL to which this role is attached

**Kind**: instance method of <code>[Role](#Role)</code>  
<a name="Role+setId"></a>
### role.setId(id) ⇒ <code>[Role](#Role)</code>
Sets the role id of this instance

**Kind**: instance method of <code>[Role](#Role)</code>  
**Returns**: <code>[Role](#Role)</code> - - This object  
**Throws**:

- <code>Error</code> - if id is not a string


| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | Role identification |

<a name="Role+getId"></a>
### role.getId() ⇒ <code>string</code>
Returns this Role id

**Kind**: instance method of <code>[Role](#Role)</code>  
**Returns**: <code>string</code> - id - Role id  
<a name="Role+setParents"></a>
### role.setParents(parents) ⇒ <code>[Role](#Role)</code>
Sets role parents.

**Kind**: instance method of <code>[Role](#Role)</code>  
**Returns**: <code>[Role](#Role)</code> - this instance for chaining  
**Throws**:

- <code>Error</code> if one of the given parents was not declared before


| Param | Type | Description |
| --- | --- | --- |
| parents | <code>Array.&lt;string&gt;</code> &#124; <code>[Array.&lt;Role&gt;](#Role)</code> &#124; <code>null</code> | Role parents: must be declared as individual roles before |

<a name="Role+getParents"></a>
### role.getParents() ⇒ <code>Array</code> &#124; <code>[Array.&lt;Role&gt;](#Role)</code>
Returns parents roles of this instance

**Kind**: instance method of <code>[Role](#Role)</code>  
<a name="Role+getParent"></a>
### role.getParent(role) ⇒ <code>[Role](#Role)</code> &#124; <code>null</code>
Get a parent from this role

**Kind**: instance method of <code>[Role](#Role)</code>  
**Returns**: <code>[Role](#Role)</code> &#124; <code>null</code> - null if parent role was not found  

| Param | Type | Description |
| --- | --- | --- |
| role | <code>[Role](#Role)</code> &#124; <code>string</code> | id or role instance to retrieve |

<a name="Role+addParent"></a>
### role.addParent(role) ⇒ <code>[Role](#Role)</code>
Add parent to this role. If it already exists in parents list, it will be replaced

**Kind**: instance method of <code>[Role](#Role)</code>  
**Returns**: <code>[Role](#Role)</code> - this instance for chaining  
**Throws**:

- <code>Error</code> if no Acl was attached to this role or if parent was not declared previously


| Param | Type | Description |
| --- | --- | --- |
| role | <code>[Role](#Role)</code> &#124; <code>string</code> | Parent Role instance of its id |

<a name="Role+addParents"></a>
### role.addParents(roles) ⇒ <code>[Role](#Role)</code>
Add an array of parents role to this instance

**Kind**: instance method of <code>[Role](#Role)</code>  
**Returns**: <code>[Role](#Role)</code> - this instance for chaining  
**Throws**:

- <code>Error</code> if no Acl was attached to this role or if one parent was not declared previously


| Param | Type | Description |
| --- | --- | --- |
| roles | <code>[Array.&lt;Role&gt;](#Role)</code> &#124; <code>Array.&lt;string&gt;</code> | to add as parents to this instance |

<a name="Role+removeParent"></a>
### role.removeParent({Role|string) ⇒ <code>[Role](#Role)</code>
Remove a parent from the list of this role's parents

**Kind**: instance method of <code>[Role](#Role)</code>  
**Returns**: <code>[Role](#Role)</code> - this instance for chaining  

| Param | Description |
| --- | --- |
| {Role|string | role Parent role isntance or its role id |

<a name="Role+removeParents"></a>
### role.removeParents(roles) ⇒ <code>[Role](#Role)</code>
Remove a role from parent list

**Kind**: instance method of <code>[Role](#Role)</code>  
**Returns**: <code>[Role](#Role)</code> - this instance for chaining  

| Param | Type | Description |
| --- | --- | --- |
| roles | <code>Array.&lt;string&gt;</code> &#124; <code>[Array.&lt;Role&gt;](#Role)</code> | to remove from parents list |

<a name="Role+toString"></a>
### role.toString() ⇒ <code>string</code>
Returns

**Kind**: instance method of <code>[Role](#Role)</code>  
**Returns**: <code>string</code> - - role Id  
	<a name="Resource"></a>
## Resource
**Kind**: global class  
**Trows**: <code>Error</code> if privileges is not an Array of strings  

* [Resource](#Resource)
    * [new Resource(id, privileges)](#new_Resource_new)
    * [.setId(id)](#Resource+setId) ⇒ <code>[Resource](#Resource)</code>
    * [.getId()](#Resource+getId) ⇒ <code>string</code>
    * [.getPrivileges()](#Resource+getPrivileges) ⇒ <code>Array.&lt;string&gt;</code>
    * [.setPrivileges(privileges)](#Resource+setPrivileges) ⇒ <code>[Resource](#Resource)</code>
    * [.addPrivilege(privilege)](#Resource+addPrivilege) ⇒ <code>[Resource](#Resource)</code>
    * [.removePrivilege(privilege)](#Resource+removePrivilege) ⇒ <code>[Resource](#Resource)</code>

<a name="new_Resource_new"></a>
### new Resource(id, privileges)
Constructor


| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | of this Resource |
| privileges | <code>Array.&lt;string&gt;</code> | access privileges for this resource |

<a name="Resource+setId"></a>
### resource.setId(id) ⇒ <code>[Resource](#Resource)</code>
Sets this resource Id

**Kind**: instance method of <code>[Resource](#Resource)</code>  
**Returns**: <code>[Resource](#Resource)</code> - instance for chaining  
**Throws**:

- <code>Error</code> if id is not a string


| Param | Type |
| --- | --- |
| id | <code>string</code> | 

<a name="Resource+getId"></a>
### resource.getId() ⇒ <code>string</code>
Retrieve resource id

**Kind**: instance method of <code>[Resource](#Resource)</code>  
**Returns**: <code>string</code> - id of this resource  
<a name="Resource+getPrivileges"></a>
### resource.getPrivileges() ⇒ <code>Array.&lt;string&gt;</code>
Retrieve access privileges for this resource

**Kind**: instance method of <code>[Resource](#Resource)</code>  
**Returns**: <code>Array.&lt;string&gt;</code> - Array of access privileges  
<a name="Resource+setPrivileges"></a>
### resource.setPrivileges(privileges) ⇒ <code>[Resource](#Resource)</code>
Sets access privileges for this resource

**Kind**: instance method of <code>[Resource](#Resource)</code>  
**Throws**:

- <code>Error</code> if privileges is not an array of strings


| Param | Type | Description |
| --- | --- | --- |
| privileges | <code>Array.&lt;string&gt;</code> | to set |

<a name="Resource+addPrivilege"></a>
### resource.addPrivilege(privilege) ⇒ <code>[Resource](#Resource)</code>
Add an access privilege to this resource

**Kind**: instance method of <code>[Resource](#Resource)</code>  
**Throw**: <code>Error</code> - if privilege is not a string  

| Param | Type |
| --- | --- |
| privilege | <code>string</code> | 

<a name="Resource+removePrivilege"></a>
### resource.removePrivilege(privilege) ⇒ <code>[Resource](#Resource)</code>
Removes access privilege from this resource

**Kind**: instance method of <code>[Resource](#Resource)</code>  
**Returns**: <code>[Resource](#Resource)</code> - - this instance  

| Param | Type | Description |
| --- | --- | --- |
| privilege | <code>string</code> | access privilege to remove |

