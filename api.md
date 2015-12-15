## Classes

<dl>
<dt><a href="#Role">Role</a></dt>
<dd><p>Role class</p>
</dd>
<dt><a href="#Role">Role</a></dt>
<dd></dd>
</dl>

<a name="Role"></a>
## Role
Role class

**Kind**: global class  

* [Role](#Role)
    * [new Role(options)](#new_Role_new)
    * [new Role(options)](#new_Role_new)
    * _instance_
        * [.setId(roleId)](#Role+setId) ⇒ <code>[Role](#Role)</code>
        * [.getId()](#Role+getId) ⇒ <code>string</code>
        * [.setParents(parents)](#Role+setParents) ⇒ <code>[Role](#Role)</code>
        * [.addParents(parents)](#Role+addParents) ⇒ <code>[Role](#Role)</code>
        * [.removeParents(parents)](#Role+removeParents) ⇒ <code>[Role](#Role)</code>
        * [.toString()](#Role+toString) ⇒ <code>string</code>
    * _static_
        * [.add(role)](#Role.add) ⇒ <code>[Role](#Role)</code>
        * [.remove(role)](#Role.remove)

<a name="new_Role_new"></a>
### new Role(options)
Constructor


| Param |
| --- |
| options | 

<a name="new_Role_new"></a>
### new Role(options)
Constructor

**Throws**:

- <code>Error</code> if one of the given parents was not declared before


| Param |
| --- |
| options | 

**Example**  
```js
var userRole = new Role({id: 'user'});
```
<a name="Role+setId"></a>
### role.setId(roleId) ⇒ <code>[Role](#Role)</code>
Sets this role Id;

**Kind**: instance method of <code>[Role](#Role)</code>  
**Returns**: <code>[Role](#Role)</code> - - This object  

| Param | Type | Description |
| --- | --- | --- |
| roleId | <code>string</code> | Role identification |

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
| parents | <code>Array</code> &#124; <code>string</code> &#124; <code>null</code> | Role parents: must be declared as individual roles before |

<a name="Role+toString"></a>
### role.toString() ⇒ <code>string</code>
Returns

**Kind**: instance method of <code>[Role](#Role)</code>  
**Returns**: <code>string</code> - - role Id  
<a name="Role.add"></a>
### Role.add(role) ⇒ <code>[Role](#Role)</code>
Adds a Role to the list of declared roles

**Kind**: static method of <code>[Role](#Role)</code>  

| Param | Type |
| --- | --- |
| role | <code>[Role](#Role)</code> | 

<a name="Role.remove"></a>
### Role.remove(role)
Deletes role frol the list of declared roles

**Kind**: static method of <code>[Role](#Role)</code>  

| Param | Type |
| --- | --- |
| role | <code>[Role](#Role)</code> &#124; <code>string</code> | 

<a name="Role"></a>
## Role
**Kind**: global class  

* [Role](#Role)
    * [new Role(options)](#new_Role_new)
    * [new Role(options)](#new_Role_new)
    * _instance_
        * [.setId(roleId)](#Role+setId) ⇒ <code>[Role](#Role)</code>
        * [.getId()](#Role+getId) ⇒ <code>string</code>
        * [.setParents(parents)](#Role+setParents) ⇒ <code>[Role](#Role)</code>
        * [.addParents(parents)](#Role+addParents) ⇒ <code>[Role](#Role)</code>
        * [.removeParents(parents)](#Role+removeParents) ⇒ <code>[Role](#Role)</code>
        * [.toString()](#Role+toString) ⇒ <code>string</code>
    * _static_
        * [.add(role)](#Role.add) ⇒ <code>[Role](#Role)</code>
        * [.remove(role)](#Role.remove)

<a name="new_Role_new"></a>
### new Role(options)
Constructor


| Param |
| --- |
| options | 

<a name="new_Role_new"></a>
### new Role(options)
Constructor

**Throws**:

- <code>Error</code> if one of the given parents was not declared before


| Param |
| --- |
| options | 

**Example**  
```js
var userRole = new Role({id: 'user'});
```
<a name="Role+setId"></a>
### role.setId(roleId) ⇒ <code>[Role](#Role)</code>
Sets this role Id;

**Kind**: instance method of <code>[Role](#Role)</code>  
**Returns**: <code>[Role](#Role)</code> - - This object  

| Param | Type | Description |
| --- | --- | --- |
| roleId | <code>string</code> | Role identification |

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
| parents | <code>Array</code> &#124; <code>string</code> &#124; <code>null</code> | Role parents: must be declared as individual roles before |

<a name="Role+toString"></a>
### role.toString() ⇒ <code>string</code>
Returns

**Kind**: instance method of <code>[Role](#Role)</code>  
**Returns**: <code>string</code> - - role Id  
<a name="Role.add"></a>
### Role.add(role) ⇒ <code>[Role](#Role)</code>
Adds a Role to the list of declared roles

**Kind**: static method of <code>[Role](#Role)</code>  

| Param | Type |
| --- | --- |
| role | <code>[Role](#Role)</code> | 

<a name="Role.remove"></a>
### Role.remove(role)
Deletes role frol the list of declared roles

**Kind**: static method of <code>[Role](#Role)</code>  

| Param | Type |
| --- | --- |
| role | <code>[Role](#Role)</code> &#124; <code>string</code> | 

