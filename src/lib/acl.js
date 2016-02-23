import _ from 'lodash';
import Role from './role';
import Resource from './resource';

/**
 * Function that will let ACL retrieve the user's "Role id". This function must return a Promise
 *
 * @name fetchRoleIdFunc
 * @function
 * @param {*} user - User which Acl should retrieve Id
 * @return {Promise}
 */

/**
 * Function that will let ACL retrieve the resource's "Resource id". This function must return a Promise
 *
 * @name fetchResourceIdFunc
 * @function
 * @param {*} resource - Resource which Acl should retrieve Id
 * @return {Promise}
 */

/**
 * Function that be used to check if User (with role Id) should be access granted to Resource (with resource Id)
 *
 * @name permissionConditionFunc
 * @function
 * @param {*} user - User which will try to access the resource
 * @param {*} resource - Resource which will be accessed
 * @return {Promise}
 */

/**
 * This class holds all information about Roles, Resources and Permissions
 */
class Acl {
	/**
	 * Constructor
	 * @example
	 * var myAcl = new Acl(function(user){
	 * 		return Promise.resolve(user.getRole());
	 * }, function(resource){
	 * 		return Promise.resolve(resource.getResourceId());
	 * });
	 *
	 * @param {fetchRoleIdFunc} roleIdFetchFunc - function that will let Acl fetch Role id (default will return empty string)
	 * @param {fetchResourceIdFunc} resourceIdFetchFunc - function that will let Acl fetch Resource id (default will return empty string)
	 */
	constructor(roleIdFetchFunc = ()=>new Promise(resolve => resolve('')), resourceIdFetchFunc = ()=>new Promise(resolve => resolve(''))) {
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
	 * @example
	 * acl.addRole('anonyme');
	 * acl.addRole('user', ['anonyme']);
	 * acl.addRole(new Role('admin', ['user'], acl));
	 * acl.addRole('super', [new Role('normal', [], acl)]);
	 *
	 *
	 * @param {Role|string} role instance to add
	 * @param {Array.<string>|Array.<Role>} Parents default is empty array
	 * @returns {Acl} this instanc@e for chaining
	 * @throws {Error} if role is not an instance of {@link Role} or a string
	 */

	addRole(role, parents = []) {
		/* istanbul ignore else  */
		if (_.isString(role))
			role = new Role(role, parents, this);

		if (role.constructor.name == 'Role')
			this.roles.push(role);
		else
			throw new Error(`${role} is not a string nor an instance of Role so I can't add it`);
		/* istanbul ignore else  */
		if (role.getAcl() == null)
			role.setAcl(this);
		return this;
	}

	/**
	 * Deletes role from the list of declared roles
	 * @example
	 * acl.remove('anonymous');
	 *
	 * @param {Role|string} role
	 * @return {Acl} this instance for chaining
	 */
	removeRole(role) {
		let roleId = role;
		if (role.constructor.name == 'Role')
			roleId = role.getId();
		this.roles = this.roles.filter((role) => role.getId() != roleId);
	}

	/**
	 * Retrieve an instance of Role identified by id. It must be added before calling this function
	 *
	 * @param {string} id - of Role to retrieve
	 * @returns {Role} a Role instance if it was previously added or null if not exists
	 */
	getRole(id) {
		let roles = this.roles.filter((role) => role.getId() == id);
		if (roles.length)
			return roles[0];
		return null;
	}

	/**
	 * Add a new resource to Access Control List
	 * @example
	 * acl.addResource(new Resource('page'));
	 * acl.addResource(new Resource('book', ['read', 'buy']);
	 *
	 * @param {Resource} resource - to add to Access Control List
	 * @returns {Acl} this instance for chaining
	 * @throws {Error} if resource is not an instance of {@link Acl}
	 */
	addResource(resource) {
		let res = this.getResource(resource);
		if (!res)
			this.resources.push(resource);
		return this;
	}

	/**
	 * Removes a resource from Access Control List
	 * @example
	 * acl.removeResource('page');
	 * acl.removeResource(bookResourceInstance);
	 *
	 * @param {Resource|string} resource to remove
	 * @throws {Error} if resource is not an instance of {@link Resource} or of type string
	 * @returns {Acl} this instance for chaining
	 */
	removeResource(resource) {
		let resourceId = resource;
		if (resource instanceof Resource)
			resourceId = resource.getId();
		this.resources = this.resources.filter((resource) => resource.getId() != resourceId);

		return this;
	}

	/**
	 * Get resource instance by its Id if it was previously added to Access Control List
	 *
	 * @example
	 * acl.getResource('page');
	 *
	 * @param {string|Resource} id - of resource to get
	 * @returns {Resource|null} Resource instance if it exists. will return null otherwise
	 */
	getResource(id) {
		let resourceId = id;
		if (id instanceof Resource)
			resourceId = id.getId();
		let resources = this.resources.filter((resource) => resource.getId() == resourceId);
		if (resources.length)
			return resources[0];
		return null;
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
		let roles = this.roles.map((role) => role.getId());
		_.forEach(roles, (roleId) => {
			if (!this.permissions[roleId])
				this.permissions[roleId] = {};
			_.forEach(this.resources, (resource) => {
				if (!this.permissions[roleId][resource.getId()])
					this.permissions[roleId][resource.getId()] = {};
				_.forEach(resource.getPrivileges(), (privilegeId) => {
					this.permissions[roleId][resource.getId()][privilegeId] = defaultPermission;
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
	 *    .allow('user', 'article', ['read', 'comment']);
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
	 *    .deny('anonymous', 'article', 'read', function(user, article){
	 * 		return article.is_public;
	 * 	  });
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
		if (!this.getRole(roleId))
			throw Error(`role id: ${roleId} could not be found`);
		if (!this.getResource(resourceId))
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
		if (!this.getRole(roleId))
			throw Error(`role id: ${roleId} could not be found`);
		if (!this.getResource(resourceId))
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
	 * @example
	 * acl.isAllowed(userObject, resourceObject, 'read');
	 * acl.isAllowed(userObject, resourceObject);
	 *
	 * @param user {*}
	 * @param resource {*}
	 * @param privilege {string}
	 * @returns {Promise}
	 */
	isAllowed(user, resource, privilege = '*') {
		let roleId = this._getRoleIdFunc(user);
		let resourceId = this._getResourceIdFunc(resource);

		return Promise.all([roleId, resourceId]).then(
			(ids) => {
				let roleId = ids[0];
				let resourceId = ids[1];
				if (!_.isString(roleId)) {
					console.error(`got roleId not a string: ${roleId}`);
					return Promise.reject();
				}
				if (!_.isString(resourceId)) {
					console.error(`got resourceId not a string: ${roleId}`);
					return Promise.reject();
				}
				if (!this.permissions[roleId]) {
					console.warn(`${roleId} was not declared so I will answer that he is not allowed`);
					return Promise.reject();
				}
				if (!this.permissions[roleId][resourceId]) {
					console.warn(`${resourceId} was not declared so I will answer that user is not allowed to this`);
					return Promise.reject();
				}
				if (!this.permissions[roleId][resourceId][privilege] && privilege != '*') {
					return this.isRoleAllowed(roleId, resourceId, '*');
				}

				if (_.isFunction(this.permissions[roleId][resourceId][privilege].condition))
					return this.isRoleAllowed(roleId, resourceId, privilege).then(
						() => {
							console.error('allowed, now checking condition');
							return this.permissions[roleId][resourceId][privilege].condition(user, resource, privilege)
						},
						() => {

							return Promise.reject();
						}
					);
				else
					return this.isRoleAllowed(roleId, resourceId, privilege);
			},
			() => {
				console.log('Errrroorrr');
			}
		)
	}

	/**
	 * Checks if roleId has access to resourceId with privilege. If not, it will check if one of the related parents
	 * has access to resource id
	 *
	 * @example
	 * acl.isRoleAllowed('user', 'book', 'read');
	 * acl.isRoleAllow('user', 'page');
	 *
	 * @param {string} roleId
	 * @param {string}resourceId
	 * @param {string} privilege
	 * @returns {Promise}
	 */
	isRoleAllowed(roleId, resourceId, privilege = '*') {
		if (!_.isString(roleId)) {
			console.warn(`got roleId not a string: ${roleId}`);
			return Promise.reject();
		}
		if (!_.isString(resourceId)) {
			console.warn(`got resourceId not a string: ${roleId}`);
			return Promise.reject();
		}
		if (!this.permissions[roleId][resourceId][privilege] && privilege != '*') {
			return this.isRoleAllowed(roleId, resourceId, '*');
		}
		let allowed = this.permissions[roleId][resourceId][privilege].allowed;
		if (allowed == null) //check parents if it was not defined how this role has access to this resource
			return this.isAnyParentAllowed(roleId, resourceId, privilege);
		else
			return allowed?Promise.resolve():Promise.reject();
	}

	/**
	 * Checks if any role's parents is allowed to access resourceId with privileges
	 *
	 * @param {string} roleId
	 * @param {string} resourceId
	 * @param {string} privilege
	 * @returns {Promise}
	 */
	isAnyParentAllowed(roleId, resourceId, privilege) {
		return new Promise((resolve, reject) => {
			let role = this.getRole(roleId);
			let parents = role.getParents();
			let checks = parents.map(parent => this.isRoleAllowed(parent.getId(), resourceId, privilege).then(
				()=>{
					return true;
				},
				()=>{
					return false;
				}
			));

			Promise.all(checks).then(
				(results) => {
					for(let result of results){
						if(result)
							resolve();
					}
					reject();
				}
			)

		});
	}

	/**
	 * Returns an object representing roleId permissions
	 * @example
	 * acl.getPermissions('user');
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
