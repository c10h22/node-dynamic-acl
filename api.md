## Classes

<dl>
<dt><a href="#Acl">Acl</a></dt>
<dd><p>This class holds all information about Roles, Resources and Permissions</p>
</dd>
<dt><a href="#Acl">Acl</a></dt>
<dd></dd>
<dt><a href="#Resource">Resource</a></dt>
<dd></dd>
<dt><a href="#Resource">Resource</a></dt>
<dd></dd>
<dt><a href="#Role">Role</a></dt>
<dd><p>Role class</p>
</dd>
<dt><a href="#Role">Role</a></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#fetchRoleIdFunc">fetchRoleIdFunc(user)</a></dt>
<dd><p>Function that will let ACL retrieve the user&#39;s &quot;Role id&quot;</p>
</dd>
<dt><a href="#fetchResourceIdFunc">fetchResourceIdFunc(resource)</a></dt>
<dd><p>Function that will let ACL retrieve the resource&#39;s &quot;Resource id&quot;</p>
</dd>
<dt><a href="#permissionConditionFunc">permissionConditionFunc(user, resource)</a></dt>
<dd><p>Function that be used to check if User (with role Id) should be access granted to Resource (with resource Id)</p>
</dd>
</dl>

<a name="Acl"></a>
## Acl
This class holds all information about Roles, Resources and Permissions

**Kind**: global class  

* [Acl](#Acl)
    * [new Acl(roleIdFetchFunc, resourceIdFetchFunc)](#new_Acl_new)
    * [new Acl(roleIdFetchFunc, resourceIdFetchFunc)](#new_Acl_new)
    * [.setRoleIdFetchFunc(func)](#Acl+setRoleIdFetchFunc) ⇒ <code>[Acl](#Acl)</code>
    * [.setResourceIdFetchFunc(func)](#Acl+setResourceIdFetchFunc) ⇒ <code>[Acl](#Acl)</code>
    * [.addRole(role)](#Acl+addRole) ⇒ <code>[Acl](#Acl)</code>
    * [.removeRole(role)](#Acl+removeRole) ⇒ <code>[Acl](#Acl)</code>
    * [.getRole(id)](#Acl+getRole) ⇒ <code>[Role](#Role)</code>
    * [.addResource(resource)](#Acl+addResource) ⇒ <code>[Acl](#Acl)</code>
    * [.removeResource(resource)](#Acl+removeResource) ⇒ <code>[Acl](#Acl)</code>
    * [.getResource(id)](#Acl+getResource) ⇒ <code>[Resource](#Resource)</code> &#124; <code>null</code>
    * [.build()](#Acl+build) ⇒ <code>[Acl](#Acl)</code>
    * [.allow(roleId, resourceId, privilege, condition)](#Acl+allow)
    * [.deny(roleId, resourceId, privilege, condition)](#Acl+deny)
    * [._allowOrDeny(allow, roleId, resourceId, privilege, condition)](#Acl+_allowOrDeny)
    * [.isAllowed(user, resource, privilege)](#Acl+isAllowed) ⇒ <code>boolean</code>
    * [.isRoleAllowed(roleId, resourceId, privilege)](#Acl+isRoleAllowed) ⇒ <code>boolean</code>
    * [.isAnyParentAllowed(roleId, resourceId, privilege)](#Acl+isAnyParentAllowed) ⇒ <code>boolean</code>
    * [.getPermissions(roleId)](#Acl+getPermissions) ⇒ <code>Array.&lt;Object&gt;</code>

<a name="new_Acl_new"></a>
### new Acl(roleIdFetchFunc, resourceIdFetchFunc)
Constructor


| Param | Type | Description |
| --- | --- | --- |
| roleIdFetchFunc | <code>[fetchRoleIdFunc](#fetchRoleIdFunc)</code> | function that will let Acl fetch Role id |
| resourceIdFetchFunc | <code>[fetchResourceIdFunc](#fetchResourceIdFunc)</code> | function that will let Acl fetch Resource id |

<a name="new_Acl_new"></a>
### new Acl(roleIdFetchFunc, resourceIdFetchFunc)
Constructor


| Param | Type | Description |
| --- | --- | --- |
| roleIdFetchFunc | <code>[fetchRoleIdFunc](#fetchRoleIdFunc)</code> | function that will let Acl fetch Role id |
| resourceIdFetchFunc | <code>[fetchResourceIdFunc](#fetchResourceIdFunc)</code> | function that will let Acl fetch Resource id |

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
### acl.addRole(role) ⇒ <code>[Acl](#Acl)</code>
Add a new Role to Access Control List

**Kind**: instance method of <code>[Acl](#Acl)</code>  
**Returns**: <code>[Acl](#Acl)</code> - this instance for chaining  
**Throws**:

- <code>Error</code> if role is not an instance of [Role](#Role)


| Param | Type | Description |
| --- | --- | --- |
| role | <code>[Role](#Role)</code> | instance to add |

<a name="Acl+removeRole"></a>
### acl.removeRole(role) ⇒ <code>[Acl](#Acl)</code>
Deletes role frol the list of declared roles

**Kind**: instance method of <code>[Acl](#Acl)</code>  
**Returns**: <code>[Acl](#Acl)</code> - this instance for chaining  

| Param | Type |
| --- | --- |
| role | <code>[Role](#Role)</code> &#124; <code>string</code> | 

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

<a name="Acl+getResource"></a>
### acl.getResource(id) ⇒ <code>[Resource](#Resource)</code> &#124; <code>null</code>
Get resource instance by its Id if it was previously added to Access Control List

**Kind**: instance method of <code>[Acl](#Acl)</code>  
**Returns**: <code>[Resource](#Resource)</code> &#124; <code>null</code> - Resource instance if it exists. will return null otherwise  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | of resource to get |

<a name="Acl+build"></a>
### acl.build() ⇒ <code>[Acl](#Acl)</code>
Build all permissions based on added [Role](#Role) and [Resource](#Resource). Permissions are initialized
to allow = false and condition = null

**Kind**: instance method of <code>[Acl](#Acl)</code>  
**Returns**: <code>[Acl](#Acl)</code> - this instance for chaining  
<a name="Acl+allow"></a>
### acl.allow(roleId, resourceId, privilege, condition)
Allow User with Role Id to access Privileged Resource (which have Resource Id) under condition

**Kind**: instance method of <code>[Acl](#Acl)</code>  

| Param | Type | Description |
| --- | --- | --- |
| roleId | <code>string</code> &#124; <code>[Role](#Role)</code> | Role Id or Role instance |
| resourceId | <code>string</code> &#124; <code>[Resource](#Resource)</code> | Resource Id or Resource instance |
| privilege | <code>string</code> | Privilege (default is '*' all) |
| condition | <code>[permissionConditionFunc](#permissionConditionFunc)</code> | Conditional permission function (default is null) |

<a name="Acl+deny"></a>
### acl.deny(roleId, resourceId, privilege, condition)
Deny User with Role Id to access Privileged Resource (which have Resource Id) under condition

**Kind**: instance method of <code>[Acl](#Acl)</code>  

| Param | Type | Description |
| --- | --- | --- |
| roleId | <code>string</code> &#124; <code>[Role](#Role)</code> | Role Id or Role instance |
| resourceId | <code>string</code> &#124; <code>[Resource](#Resource)</code> | Resource Id or Resource instance |
| privilege | <code>string</code> | Privilege (default is '*' all) |
| condition | <code>[permissionConditionFunc](#permissionConditionFunc)</code> | Conditional permission function (default is null) |

<a name="Acl+_allowOrDeny"></a>
### acl._allowOrDeny(allow, roleId, resourceId, privilege, condition)
Allow User with Role Id to access Privileged Resource (which have Resource Id) under condition

**Kind**: instance method of <code>[Acl](#Acl)</code>  

| Param | Type | Description |
| --- | --- | --- |
| allow | <code>boolean</code> | true = allowed, false = denied |
| roleId | <code>string</code> &#124; <code>[Role](#Role)</code> | Role Id or Role instance |
| resourceId | <code>string</code> &#124; <code>[Resource](#Resource)</code> | Resource Id or Resource instance |
| privilege | <code>string</code> | Privilege (default is '*' all) |
| condition | <code>[permissionConditionFunc](#permissionConditionFunc)</code> | Conditional permission function (default is null) |

<a name="Acl+isAllowed"></a>
### acl.isAllowed(user, resource, privilege) ⇒ <code>boolean</code>
Checks if user is allowed to access resource with a given privilege. If yes, it checks condition

**Kind**: instance method of <code>[Acl](#Acl)</code>  

| Param | Type |
| --- | --- |
| user | <code>\*</code> | 
| resource | <code>\*</code> | 
| privilege | <code>string</code> | 

<a name="Acl+isRoleAllowed"></a>
### acl.isRoleAllowed(roleId, resourceId, privilege) ⇒ <code>boolean</code>
Checks if roleId has access to resourceId with privilege. If not, it will check if one of the related parents
has access to resource id

**Kind**: instance method of <code>[Acl](#Acl)</code>  

| Param | Type |
| --- | --- |
| roleId | <code>string</code> | 
| resourceId | <code>string</code> | 
| privilege | <code>string</code> | 

<a name="Acl+isAnyParentAllowed"></a>
### acl.isAnyParentAllowed(roleId, resourceId, privilege) ⇒ <code>boolean</code>
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

<a name="Acl"></a>
## Acl
**Kind**: global class  

* [Acl](#Acl)
    * [new Acl(roleIdFetchFunc, resourceIdFetchFunc)](#new_Acl_new)
    * [new Acl(roleIdFetchFunc, resourceIdFetchFunc)](#new_Acl_new)
    * [.setRoleIdFetchFunc(func)](#Acl+setRoleIdFetchFunc) ⇒ <code>[Acl](#Acl)</code>
    * [.setResourceIdFetchFunc(func)](#Acl+setResourceIdFetchFunc) ⇒ <code>[Acl](#Acl)</code>
    * [.addRole(role)](#Acl+addRole) ⇒ <code>[Acl](#Acl)</code>
    * [.removeRole(role)](#Acl+removeRole) ⇒ <code>[Acl](#Acl)</code>
    * [.getRole(id)](#Acl+getRole) ⇒ <code>[Role](#Role)</code>
    * [.addResource(resource)](#Acl+addResource) ⇒ <code>[Acl](#Acl)</code>
    * [.removeResource(resource)](#Acl+removeResource) ⇒ <code>[Acl](#Acl)</code>
    * [.getResource(id)](#Acl+getResource) ⇒ <code>[Resource](#Resource)</code> &#124; <code>null</code>
    * [.build()](#Acl+build) ⇒ <code>[Acl](#Acl)</code>
    * [.allow(roleId, resourceId, privilege, condition)](#Acl+allow)
    * [.deny(roleId, resourceId, privilege, condition)](#Acl+deny)
    * [._allowOrDeny(allow, roleId, resourceId, privilege, condition)](#Acl+_allowOrDeny)
    * [.isAllowed(user, resource, privilege)](#Acl+isAllowed) ⇒ <code>boolean</code>
    * [.isRoleAllowed(roleId, resourceId, privilege)](#Acl+isRoleAllowed) ⇒ <code>boolean</code>
    * [.isAnyParentAllowed(roleId, resourceId, privilege)](#Acl+isAnyParentAllowed) ⇒ <code>boolean</code>
    * [.getPermissions(roleId)](#Acl+getPermissions) ⇒ <code>Array.&lt;Object&gt;</code>

<a name="new_Acl_new"></a>
### new Acl(roleIdFetchFunc, resourceIdFetchFunc)
Constructor


| Param | Type | Description |
| --- | --- | --- |
| roleIdFetchFunc | <code>[fetchRoleIdFunc](#fetchRoleIdFunc)</code> | function that will let Acl fetch Role id |
| resourceIdFetchFunc | <code>[fetchResourceIdFunc](#fetchResourceIdFunc)</code> | function that will let Acl fetch Resource id |

<a name="new_Acl_new"></a>
### new Acl(roleIdFetchFunc, resourceIdFetchFunc)
Constructor


| Param | Type | Description |
| --- | --- | --- |
| roleIdFetchFunc | <code>[fetchRoleIdFunc](#fetchRoleIdFunc)</code> | function that will let Acl fetch Role id |
| resourceIdFetchFunc | <code>[fetchResourceIdFunc](#fetchResourceIdFunc)</code> | function that will let Acl fetch Resource id |

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
### acl.addRole(role) ⇒ <code>[Acl](#Acl)</code>
Add a new Role to Access Control List

**Kind**: instance method of <code>[Acl](#Acl)</code>  
**Returns**: <code>[Acl](#Acl)</code> - this instance for chaining  
**Throws**:

- <code>Error</code> if role is not an instance of [Role](#Role)


| Param | Type | Description |
| --- | --- | --- |
| role | <code>[Role](#Role)</code> | instance to add |

<a name="Acl+removeRole"></a>
### acl.removeRole(role) ⇒ <code>[Acl](#Acl)</code>
Deletes role frol the list of declared roles

**Kind**: instance method of <code>[Acl](#Acl)</code>  
**Returns**: <code>[Acl](#Acl)</code> - this instance for chaining  

| Param | Type |
| --- | --- |
| role | <code>[Role](#Role)</code> &#124; <code>string</code> | 

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

<a name="Acl+getResource"></a>
### acl.getResource(id) ⇒ <code>[Resource](#Resource)</code> &#124; <code>null</code>
Get resource instance by its Id if it was previously added to Access Control List

**Kind**: instance method of <code>[Acl](#Acl)</code>  
**Returns**: <code>[Resource](#Resource)</code> &#124; <code>null</code> - Resource instance if it exists. will return null otherwise  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | of resource to get |

<a name="Acl+build"></a>
### acl.build() ⇒ <code>[Acl](#Acl)</code>
Build all permissions based on added [Role](#Role) and [Resource](#Resource). Permissions are initialized
to allow = false and condition = null

**Kind**: instance method of <code>[Acl](#Acl)</code>  
**Returns**: <code>[Acl](#Acl)</code> - this instance for chaining  
<a name="Acl+allow"></a>
### acl.allow(roleId, resourceId, privilege, condition)
Allow User with Role Id to access Privileged Resource (which have Resource Id) under condition

**Kind**: instance method of <code>[Acl](#Acl)</code>  

| Param | Type | Description |
| --- | --- | --- |
| roleId | <code>string</code> &#124; <code>[Role](#Role)</code> | Role Id or Role instance |
| resourceId | <code>string</code> &#124; <code>[Resource](#Resource)</code> | Resource Id or Resource instance |
| privilege | <code>string</code> | Privilege (default is '*' all) |
| condition | <code>[permissionConditionFunc](#permissionConditionFunc)</code> | Conditional permission function (default is null) |

<a name="Acl+deny"></a>
### acl.deny(roleId, resourceId, privilege, condition)
Deny User with Role Id to access Privileged Resource (which have Resource Id) under condition

**Kind**: instance method of <code>[Acl](#Acl)</code>  

| Param | Type | Description |
| --- | --- | --- |
| roleId | <code>string</code> &#124; <code>[Role](#Role)</code> | Role Id or Role instance |
| resourceId | <code>string</code> &#124; <code>[Resource](#Resource)</code> | Resource Id or Resource instance |
| privilege | <code>string</code> | Privilege (default is '*' all) |
| condition | <code>[permissionConditionFunc](#permissionConditionFunc)</code> | Conditional permission function (default is null) |

<a name="Acl+_allowOrDeny"></a>
### acl._allowOrDeny(allow, roleId, resourceId, privilege, condition)
Allow User with Role Id to access Privileged Resource (which have Resource Id) under condition

**Kind**: instance method of <code>[Acl](#Acl)</code>  

| Param | Type | Description |
| --- | --- | --- |
| allow | <code>boolean</code> | true = allowed, false = denied |
| roleId | <code>string</code> &#124; <code>[Role](#Role)</code> | Role Id or Role instance |
| resourceId | <code>string</code> &#124; <code>[Resource](#Resource)</code> | Resource Id or Resource instance |
| privilege | <code>string</code> | Privilege (default is '*' all) |
| condition | <code>[permissionConditionFunc](#permissionConditionFunc)</code> | Conditional permission function (default is null) |

<a name="Acl+isAllowed"></a>
### acl.isAllowed(user, resource, privilege) ⇒ <code>boolean</code>
Checks if user is allowed to access resource with a given privilege. If yes, it checks condition

**Kind**: instance method of <code>[Acl](#Acl)</code>  

| Param | Type |
| --- | --- |
| user | <code>\*</code> | 
| resource | <code>\*</code> | 
| privilege | <code>string</code> | 

<a name="Acl+isRoleAllowed"></a>
### acl.isRoleAllowed(roleId, resourceId, privilege) ⇒ <code>boolean</code>
Checks if roleId has access to resourceId with privilege. If not, it will check if one of the related parents
has access to resource id

**Kind**: instance method of <code>[Acl](#Acl)</code>  

| Param | Type |
| --- | --- |
| roleId | <code>string</code> | 
| resourceId | <code>string</code> | 
| privilege | <code>string</code> | 

<a name="Acl+isAnyParentAllowed"></a>
### acl.isAnyParentAllowed(roleId, resourceId, privilege) ⇒ <code>boolean</code>
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

<a name="Resource"></a>
## Resource
**Kind**: global class  

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

<a name="Role"></a>
## Role
Role class

**Kind**: global class  

* [Role](#Role)
    * [new Role(options)](#new_Role_new)
    * [new Role(options)](#new_Role_new)
    * [.setId(id)](#Role+setId) ⇒ <code>[Role](#Role)</code>
    * [.getId()](#Role+getId) ⇒ <code>string</code>
    * [.setParents(parents)](#Role+setParents) ⇒ <code>[Role](#Role)</code>
    * [.getParents()](#Role+getParents) ⇒ <code>[Array.&lt;Role&gt;](#Role)</code>
    * [.getParent(id)](#Role+getParent) ⇒ <code>[Role](#Role)</code> &#124; <code>null</code>
    * [.addParents(parents)](#Role+addParents) ⇒ <code>[Role](#Role)</code>
    * [.removeParents(parents)](#Role+removeParents) ⇒ <code>[Role](#Role)</code>
    * [.toString()](#Role+toString) ⇒ <code>string</code>

<a name="new_Role_new"></a>
### new Role(options)
Constructor


| Param | Type | Description |
| --- | --- | --- |
| options | <code>string</code> &#124; <code>Object</code> | id of this role or an object representing its properties |

<a name="new_Role_new"></a>
### new Role(options)
Constructor

**Throws**:

- <code>Error</code> if one of the given parents was not declared before


| Param | Type | Description |
| --- | --- | --- |
| options | <code>string</code> &#124; <code>Object</code> | id of this role or an object representing its properties |

**Example**  
```js
var userRole = new Role({id: 'user'});
var adminRole = new Role('admin', 'user');
var supervisor = new Role({id:'supervisor', parents: ['admin']});
```
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
**Throws**:

- <code>Error</code> if one of the given parents was not declared before


| Param | Type | Description |
| --- | --- | --- |
| parents | <code>Array</code> &#124; <code>string</code> &#124; <code>null</code> | Role parents: must be declared as individual roles before |

<a name="Role+getParents"></a>
### role.getParents() ⇒ <code>[Array.&lt;Role&gt;](#Role)</code>
Returns an array of parent roles instances

**Kind**: instance method of <code>[Role](#Role)</code>  
**Returns**: <code>[Array.&lt;Role&gt;](#Role)</code> - Array of parent roles  
<a name="Role+getParent"></a>
### role.getParent(id) ⇒ <code>[Role](#Role)</code> &#124; <code>null</code>
Returns an instance of parent role

**Kind**: instance method of <code>[Role](#Role)</code>  
**Returns**: <code>[Role](#Role)</code> &#124; <code>null</code> - - Parent instance or null if id is not a parent of this resource  
**Throw**: <code>Error</code> - if id is not a valid Role id  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | Parent id |

<a name="Role+addParents"></a>
### role.addParents(parents) ⇒ <code>[Role](#Role)</code>
Add parents to existing list of parents

**Kind**: instance method of <code>[Role](#Role)</code>  
**Throws**:

- <code>Error</code> if one of the given parents was not declared before


| Param | Type | Description |
| --- | --- | --- |
| parents | <code>Array</code> &#124; <code>string</code> &#124; <code>null</code> | Role parents: must be declared as individual roles before |

<a name="Role+removeParents"></a>
### role.removeParents(parents) ⇒ <code>[Role](#Role)</code>
Remove parents from this role.

**Kind**: instance method of <code>[Role](#Role)</code>  

| Param | Type | Description |
| --- | --- | --- |
| parents | <code>Array</code> &#124; <code>string</code> &#124; <code>null</code> &#124; <code>[Role](#Role)</code> | Role parents: must be declared as individual roles before |

<a name="Role+toString"></a>
### role.toString() ⇒ <code>string</code>
Returns

**Kind**: instance method of <code>[Role](#Role)</code>  
**Returns**: <code>string</code> - - role Id  
<a name="Role"></a>
## Role
**Kind**: global class  
**Oaram**: <code>Array</code> parents - An array containing all parents ids  

* [Role](#Role)
    * [new Role(options)](#new_Role_new)
    * [new Role(options)](#new_Role_new)
    * [.setId(id)](#Role+setId) ⇒ <code>[Role](#Role)</code>
    * [.getId()](#Role+getId) ⇒ <code>string</code>
    * [.setParents(parents)](#Role+setParents) ⇒ <code>[Role](#Role)</code>
    * [.getParents()](#Role+getParents) ⇒ <code>[Array.&lt;Role&gt;](#Role)</code>
    * [.getParent(id)](#Role+getParent) ⇒ <code>[Role](#Role)</code> &#124; <code>null</code>
    * [.addParents(parents)](#Role+addParents) ⇒ <code>[Role](#Role)</code>
    * [.removeParents(parents)](#Role+removeParents) ⇒ <code>[Role](#Role)</code>
    * [.toString()](#Role+toString) ⇒ <code>string</code>

<a name="new_Role_new"></a>
### new Role(options)
Constructor


| Param | Type | Description |
| --- | --- | --- |
| options | <code>string</code> &#124; <code>Object</code> | id of this role or an object representing its properties |

<a name="new_Role_new"></a>
### new Role(options)
Constructor

**Throws**:

- <code>Error</code> if one of the given parents was not declared before


| Param | Type | Description |
| --- | --- | --- |
| options | <code>string</code> &#124; <code>Object</code> | id of this role or an object representing its properties |

**Example**  
```js
var userRole = new Role({id: 'user'});
var adminRole = new Role('admin', 'user');
var supervisor = new Role({id:'supervisor', parents: ['admin']});
```
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
**Throws**:

- <code>Error</code> if one of the given parents was not declared before


| Param | Type | Description |
| --- | --- | --- |
| parents | <code>Array</code> &#124; <code>string</code> &#124; <code>null</code> | Role parents: must be declared as individual roles before |

<a name="Role+getParents"></a>
### role.getParents() ⇒ <code>[Array.&lt;Role&gt;](#Role)</code>
Returns an array of parent roles instances

**Kind**: instance method of <code>[Role](#Role)</code>  
**Returns**: <code>[Array.&lt;Role&gt;](#Role)</code> - Array of parent roles  
<a name="Role+getParent"></a>
### role.getParent(id) ⇒ <code>[Role](#Role)</code> &#124; <code>null</code>
Returns an instance of parent role

**Kind**: instance method of <code>[Role](#Role)</code>  
**Returns**: <code>[Role](#Role)</code> &#124; <code>null</code> - - Parent instance or null if id is not a parent of this resource  
**Throw**: <code>Error</code> - if id is not a valid Role id  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | Parent id |

<a name="Role+addParents"></a>
### role.addParents(parents) ⇒ <code>[Role](#Role)</code>
Add parents to existing list of parents

**Kind**: instance method of <code>[Role](#Role)</code>  
**Throws**:

- <code>Error</code> if one of the given parents was not declared before


| Param | Type | Description |
| --- | --- | --- |
| parents | <code>Array</code> &#124; <code>string</code> &#124; <code>null</code> | Role parents: must be declared as individual roles before |

<a name="Role+removeParents"></a>
### role.removeParents(parents) ⇒ <code>[Role](#Role)</code>
Remove parents from this role.

**Kind**: instance method of <code>[Role](#Role)</code>  

| Param | Type | Description |
| --- | --- | --- |
| parents | <code>Array</code> &#124; <code>string</code> &#124; <code>null</code> &#124; <code>[Role](#Role)</code> | Role parents: must be declared as individual roles before |

<a name="Role+toString"></a>
### role.toString() ⇒ <code>string</code>
Returns

**Kind**: instance method of <code>[Role](#Role)</code>  
**Returns**: <code>string</code> - - role Id  
<a name="fetchRoleIdFunc"></a>
## fetchRoleIdFunc(user)
Function that will let ACL retrieve the user's "Role id"

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| user | <code>\*</code> | User which Acl should retrieve Id |

<a name="fetchResourceIdFunc"></a>
## fetchResourceIdFunc(resource)
Function that will let ACL retrieve the resource's "Resource id"

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| resource | <code>\*</code> | Resource which Acl should retrieve Id |

<a name="permissionConditionFunc"></a>
## permissionConditionFunc(user, resource)
Function that be used to check if User (with role Id) should be access granted to Resource (with resource Id)

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| user | <code>\*</code> | User which will try to access the resource |
| resource | <code>\*</code> | Resource which will be accessed |

