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

	build() {
		_.forEach(this.roles, (roleId) => {
			if (!this.permissions[roleId])
				this.permissions[roleId] = {};
			_.forEach(this.resources, (resourceId) => {
				if (!this.permissions[roleId][resourceId])
					this.permissions[roleId][resourceId] = {};
				_.forEach(this.getResource(resourceId).getPrivileges(), (privilegeId) => {
					this.permissions[roleId][resourceId][privilegeId] = {
						allowed: false,
						condition: null
					};
				});
			});
		});
		return this;
	}




}

export default Acl;
