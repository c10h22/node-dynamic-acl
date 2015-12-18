import _ from 'lodash';
import Role from './role';
import Resource from './resource';

/**
 * Function that will let ACL retrieve the user's "Role id"
 *
 * @name fetchRoleIdFunc
 * @function
 * @param {*} user - User which Acl should retrieve Id
 */

/**
 * Function that will let ACL retrieve the resource's "Resource id"
 *
 * @name fetchResourceIdFunc
 * @function
 * @param {*} resource - Resource which Acl should retrieve Id
 */

/**
 * Function that be used to check if User (with role Id) should be access granted to Resource (with resource Id)
 *
 * @name permissionConditionFunc
 * @function
 * @param {*} user - User which will try to access the resource
 * @param {*} resource - Resource which will be accessed
 */

/**
 * This class holds all information about Roles, Resources and Permissions
 */
class Acl {
	/**
	 * Constructor
	 *
	 * @param {fetchRoleIdFunc} roleIdFetchFunc - function that will let Acl fetch Role id
	 * @param {fetchResourceIdFunc} resourceIdFetchFunc - function that will let Acl fetch Resource id
	 */
	constructor(roleIdFetchFunc = ()=>'', resourceIdFetchFunc = () => '') {
		this.setRoleIdFetchFunc(roleIdFetchFunc);
		this.setResourceIdFetchFunc(resourceIdFetchFunc);
		this.roles = [];
		this.resources = [];
		this.permissions = {};
	}


	/**
	 * Sets how Acl should retrieve Role Id
	 *
	 * @param {fetchRoleIdFunc} func - that will let Acl fetch Role Id from an object that may have a role
	 * @returns {Acl} this instance for chaining
	 */
	setRoleIdFetchFunc(func) {
		if (!_.isFunction(func))
			throw Error(`Provided func parameter is not a function`);
		this._getRoleIdFunc = func;
		return this;
	}

	/**
	 * Sets how Acl should retrieve Resource Id
	 *
	 * @param {fetchResourceIdFunc} func - that will let Acl fetch Resource Id from an object that may be a resource
	 * @returns {Acl} this instance for chaining
	 */
	setResourceIdFetchFunc(func) {
		if (!_.isFunction(func))
			throw Error(`Provided func parameter is not a function`);
		this._getResourceIdFunc = func;
		return this;
	}

	/**
	 * Add a new Role to Access Control List
	 *
	 * @param {Role} role instance to add
	 * @returns {Acl} this instance for chaining
	 * @throws {Error} if role is not an instance of {@link Role}
	 */
	addRole(role) {
		let roleInstance = Role._add(role);
		this.roles.push(roleInstance.getId());
		this.roles = _.unique(this.roles);
		return this;
	}

	/**
	 * Deletes role frol the list of declared roles
	 *
	 * @param {Role|string} role
	 * @return {Acl} this instance for chaining
	 */
	removeRole(role) {
		let roleId = Role._remove(role);
		this.roles = _.without(this.roles, roleId);
		return this;
	}

	/**
	 * Retrieve an instance of Role identified by id. It must be added before calling this function
	 *
	 * @param {string} id - of Role to retrieve
	 * @returns {Role} a Role instance if it was previously added or null if not exists
	 */
	getRole(id) {
		return Role._get(id);
	}

	/**
	 * Add a new resource to Access Control List
	 *
	 * @param {Resource} resource - to add to Access Control List
	 * @returns {Acl} this instance for chaining
	 * @throws {Error} if resource is not an instance of {@link Acl}
	 */
	addResource(resource) {
		let resourceInstance = Resource._add(resource);
		this.resources.push(resourceInstance.getId());
		this.resources = _.unique(this.resources);
		return this;
	}

	/**
	 * Removes a resource from Access Control List
	 *
	 * @param {Resource|string} resource to remove
	 * @throws {Error} if resource is not an instance of {@link Resource} or of type string
	 * @returns {Acl} this instance for chaining
	 */
	removeResource(resource) {
		let resourceId = Resource._remove(resource);
		this.resources = _.without(this.resources, resourceId);

		return this;
	}

	/**
	 * Get resource instance by its Id if it was previously added to Access Control List
	 *
	 * @param {string} id - of resource to get
	 * @returns {Resource|null} Resource instance if it exists. will return null otherwise
	 */
	getResource(id) {
		return Resource._get(id);
	}

	/**
	 * Build all permissions based on added {@link Role} and {@link Resource}. Permissions are initialized
	 * to allow = false and condition = null
	 *
	 * @returns {Acl} this instance for chaining
	 */
	build() {
		let defaultPermission = {
			allowed: null,
			condition: null
		};
		_.forEach(this.roles, (roleId) => {
			if (!this.permissions[roleId])
				this.permissions[roleId] = {};
			_.forEach(this.resources, (resourceId) => {
				if (!this.permissions[roleId][resourceId])
					this.permissions[roleId][resourceId] = {};
				_.forEach(this.getResource(resourceId).getPrivileges(), (privilegeId) => {
					this.permissions[roleId][resourceId][privilegeId] = defaultPermission;
				});
			});
		});
		return this;
	}

	/**
	 * Allow User with Role Id to access Privileged Resource (which have Resource Id) under condition
	 *
	 * @example
	 *
	 * acl.allow('user', 'article', 'write')
	 *        .allow('user', 'article', ['read', 'comment']);
	 *    .allow('user', 'article', 'modify', function(user, blog){
	 * 		return user.id == article.author_id;
	 * 		});
	 *
	 * @param roleId {string|Role} - Role Id or Role instance
	 * @param resourceId {string|Resource} Resource Id or Resource instance
	 * @param privilege {string|Array.<string>} Privilege (default is '*' all)
	 * @param condition {permissionConditionFunc} Conditional permission function (default is null)
	 * @return {Acl} this instance for chaining
	 *
	 */

	allow(roleId, resourceId, privilege = '*', condition = null) {
		if (_.isArray(privilege)) {
			privilege.map((p) => {
				this.allow(roleId, resourceId, p, condition);
			});
			return this;
		} else {
			return this._allowOrDeny(true, roleId, resourceId, privilege, condition);
		}
	}

	/**
	 * Deny User with Role Id to access Privileged Resource (which have Resource Id) under condition
	 *
	 * @example
	 * acl.deny('anonymous', 'article', 'write')
	 *    .deny('anonymous', 'article', ['modify', 'comment'])
	 *      .deny('anonymous', 'article', 'read', function(user, article){
	 * 		return article.is_public;
	 * });
	 *
	 * @param roleId {string|Role} - Role Id or Role instance
	 * @param resourceId {string|Resource} - Resource Id or Resource instance
	 * @param privilege {string|Array.<string>} - Privilege (default is '*' all)
	 * @param condition {permissionConditionFunc} - Conditional permission function (default is null)
	 * @return {Acl} this instance for chaining
	 */

	deny(roleId, resourceId, privilege = '*', condition = null) {
		if (_.isArray(privilege)) {
			privilege.map((p)=> {
				this.deny(roleId, resourceId, p, condition)
			});
			return this;
		}
		return this._allowOrDeny(false, roleId, resourceId, privilege, condition);
	}

	/**
	 * Allow User with Role Id to access Privileged Resource (which have Resource Id) under condition
	 * @param allow {boolean} true = allowed, false = denied
	 * @param roleId {string|Role} - Role Id or Role instance
	 * @param resourceId {string|Resource} - Resource Id or Resource instance
	 * @param privilege {string} - Privilege (default is '*' all)
	 * @param condition {permissionConditionFunc} - Conditional permission function (default is null)
	 */

	_allowOrDeny(allow, roleId, resourceId, privilege = '*', condition = null) {
		if (!_.isString(roleId) && roleId.constructor.name != 'Role')
			throw Error(`Role must be a string or an instance of Role: ${roleId} given`);
		if (!_.isString(privilege))
			throw Error(`privilege must be a string: ${privilege} given`);
		if (condition != null && !_.isFunction(condition))
			throw Error(`provided condition is not a valid function: ${condition} given`);
		if (roleId.constructor.name == 'Role')
			roleId = roleId.getId();
		if (resourceId.constructor.name == 'Resource')
			resourceId = resourceId.getId();
		if (!_.contains(this.roles, roleId))
			throw Error(`role id: ${roleId} could not be found`);
		if (!_.contains(this.resources, resourceId))
			throw Error(`resource id: ${resourceId} could not be found`);
		if (!this.permissions[roleId][resourceId][privilege])
			throw Error(`privilege ${privilege} could not be found`);
		if (privilege != '*')
			this.permissions[roleId][resourceId][privilege] = {
				allowed: allow,
				condition: condition
			};
		else
			this._allowOrDenyAll(allow, roleId, resourceId);
		return this;
	}

	/**
	 *
	 * @param allow
	 * @param roleId
	 * @param resourceId
	 * @returns {Acl}
	 * @private
	 */
	_allowOrDenyAll(allow, roleId, resourceId) {
		if (!_.isString(roleId) && roleId.constructor.name != 'Role')
			throw Error(`Role must be a string or an instance of Role: ${roleId} given`);
		if (roleId.constructor.name == 'Role')
			roleId = roleId.getId();
		if (resourceId.constructor.name == 'Resource')
			resourceId = resourceId.getId();
		if (!_.contains(this.roles, roleId))
			throw Error(`role id: ${roleId} could not be found`);
		if (!_.contains(this.resources, resourceId))
			throw Error(`resource id: ${resourceId} could not be found`);
		for (let privilege of Object.keys(this.permissions[roleId][resourceId]))
			this.permissions[roleId][resourceId][privilege] = {
				allowed: allow,
				condition: null
			};
		return this;
	}

	/**
	 * Checks if user is allowed to access resource with a given privilege. If yes, it checks condition
	 *
	 * @param user {*}
	 * @param resource {*}
	 * @param privilege {string}
	 * @returns {boolean}
	 */
	isAllowed(user, resource, privilege = '*') {
		let roleId = this._getRoleIdFunc(user);
		let resourceId = this._getResourceIdFunc(resource);

		if (!_.isString(roleId)) {
			console.error(`got roleId not a string: ${roleId}`);
			return false;
		}
		if (!_.isString(resourceId)) {
			console.error(`got resourceId not a string: ${roleId}`);
			return false;
		}
		if (!this.permissions[roleId]) {
			console.warn(`${roleId} was not declared so I will answer that he is not allowed`);
			return false;
		}
		if (!this.permissions[roleId][resourceId]) {
			console.warn(`${resourceId} was not declared so I will answer that user is not allowed to this`);
			return false;
		}
		if (!this.permissions[roleId][resourceId][privilege] && privilege != '*') {
			return this.isRoleAllowed(roleId, resourceId, '*');
		}

		if (_.isFunction(this.permissions[roleId][resourceId][privilege].condition))
			return this.isRoleAllowed(roleId, resourceId, privilege) && this.permissions[roleId][resourceId][privilege].condition(user, resource, privilege);
		else
			return this.isRoleAllowed(roleId, resourceId, privilege);

	}

	/**
	 * Checks if roleId has access to resourceId with privilege. If not, it will check if one of the related parents
	 * has access to resource id
	 *
	 * @param {string} roleId
	 * @param {string}resourceId
	 * @param {string} privilege
	 * @returns {boolean}
	 */
	isRoleAllowed(roleId, resourceId, privilege = '*') {
		if (!_.isString(roleId)) {
			console.warn(`got roleId not a string: ${roleId}`);
			return false;
		}
		if (!_.isString(resourceId)) {
			console.warn(`got resourceId not a string: ${roleId}`);
			return false;
		}
		if (!this.permissions[roleId][resourceId][privilege] && privilege != '*') {
			return this.isRoleAllowed(roleId, resourceId, '*');
		}
		let allowed = this.permissions[roleId][resourceId][privilege].allowed;
		if (allowed == null) //check parents if it was not defined how this role has access to this resource
			return this.isAnyParentAllowed(roleId, resourceId, privilege);
		else
			return allowed;
	}

	/**
	 * Checks if any role's parents is allowed to access resourceId with privileges
	 *
	 * @param {string} roleId
	 * @param {string} resourceId
	 * @param {string} privilege
	 * @returns {boolean}
	 */
	isAnyParentAllowed(roleId, resourceId, privilege) {
		let role = this.getRole(roleId);
		let parents = role.getParents();
		for (let parent of parents) {
			if (this.isRoleAllowed(parent.getId(), resourceId, privilege))
				return true;
		}
		return false;

	}

	/**
	 * Returns an object representing roleId permissions
	 * @param {string|Role} roleId
	 * @returns {Array.<Object>} Permissions for each resource
	 */
	getPermissions(roleId) {
		if (!_.isString(roleId) && roleId.constructor.name != 'Role')
			throw Error(`Role must be a string or an instance of Role: ${roleId} given`);
		if (roleId.constructor.name == 'Role')
			roleId = roleId.getId();
		return this.permissions[roleId];
	}


}

export default Acl;
