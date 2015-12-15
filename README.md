node-dynamic-acl
==========

Dynamic Access Control List for Node.js to fully control your Roles, Resources, Privileges and Conditions


##API



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

