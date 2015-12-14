import _ from 'lodash';

/**
 * Role class
 */
class Role {
	/**
	 * Constructor
	 * @param {string|Object} options - id of this role or an object representing its properties
	 * @oaram {Array} parents - An array containing all parents ids
	 * @throws {Error} if one of the given parents was not declared before
	 * @example
	 * var userRole = new Role({id: 'user'});
	 * @example
	 * var adminRole = new Role('admin', 'user');
	 * @example
	 * var supervisor = new Role({id:'supervisor', parents: ['admin']})
	 */
	constructor(options, parents = null) {
		if (_.isPlainObject(options) && !parents) {
			this.setId(options.id);
			this.setParents(options.parents);
		} else if (_.isString(options) && !parents) {
			this.setId(options);
			this.setParents([]);
		} else if (_.isString(options)) {
			this.setId(options);
			this.setParents(parents);
		} else {
			throw Error(`Invalid constructor`);
		}

	}

	/**
	 * Sets the role id of this instance
	 *
	 * @param {string} id - Role identification
	 * @returns {Role} - This object
	 * @throws {Error} - if id is not a string
	 */
	setId(id) {
		if (!_.isString(id))
			throw new Error(`Resource ${id} cannot be renamed: roleId must be a string`);
		this.id = id;
		return this;
	}

	/**
	 * Returns this Role id
	 *
	 * @returns {string} id - Role id
	 */
	getId() {
		return this.id;
	}

	/**
	 * Sets role parents.
	 *
	 * @param {Array|string|null} parents - Role parents: must be declared as individual roles before
	 * @returns {Role}
	 * @throws {Error} if one of the given parents was not declared before
	 */
	setParents(parents) {
		let roleParents = parents;
		Role._checkRoleExist(parents);
		if (parents == null) {
			roleParents = [];
		} else if (_.isString(parents)) {
			roleParents = [parents];
		}
		this.parents = roleParents;
		return this;
	}

	/**
	 * Returns an array of parent roles
	 *
	 * @returns {Array} - of parent roles
	 */
	getParents() {
		return this.parents.map((parentId) => Role._get(parentId));
	}

	/**
	 * Returns an instance of parent role
	 *
	 * @param {string} id - Parent id
	 * @returns {Role|null} - Parent instance or null if id is not a parent of this resource
	 * @throw {Error} - if id is not a valid Role id
	 */
	getParent(id) {
		Role._checkRoleExist(id);
		if (_.indexOf(this.parents, id) > -1) {
			return Role.ids[id];
		}
		return null;
	}

	/**
	 * Add parents to existing list of parents
	 *
	 * @param {Array|string|null} parents - Role parents: must be declared as individual roles before
	 * @returns {Role}
	 * @throws {Error} if one of the given parents was not declared before
	 */
	addParents(parents) {
		Role._checkRoleExist(parents);
		let roleParents = parents;
		if (parents == null) {
			roleParents = [];
		} else if (_.isString(parents)) {
			roleParents = [parents];
		}
		this.parents = _.union(this.parents, roleParents);
		return this;
	}

	/**
	 * Remove parents from this role.
	 *
	 * @param {Array|string|null|Role} parents - Role parents: must be declared as individual roles before
	 * @returns {Role}
	 */
	removeParents(parents) {
		let roleParents = parents;
		if (parents == null) {
			roleParents = [];
		} else if (_.isString(parents)) {
			roleParents = [parents];
		} else if (parents.constructor.name == 'Role') {
			roleParents = [parents.getId()];
		}
		for (let parent of roleParents) {
			_.pull(this.parents, parent);
		}
		return this;
	}

	/**
	 * Returns a registred role represented by its id
	 * @private
	 * @param {string} id - of the role to get
	 * @returns {Role}
	 */
	static _get(id) {
		return Role.ids[id];
	}

	/**
	 * Adds a Role to the list of declared roles
	 * @private
	 * @param {Role} role
	 * @returns {Role}
	 */
	static _add(role) {
		if (!role instanceof Role)
			throw Error(`You are trying to add an object that is not an instance of Role`);
		if (!Role.ids)
			Role.ids = {};

		Role.ids[role.getId()] = role;
		return Role.ids[role.getId()];
	}

	/**
	 * Deletes role from the list of declared roles
	 * @private
	 * @param {Role|string} role
	 */
	static _remove(role) {
		let roleId = role;
		if (role instanceof Role)
			roleId = role.getId();
		else if (!_.isString(role)) {
			throw Error(`Cannot remove ${role}: it must be an instance of Role or of type string`);
		}

		_.forEach(Role.ids, (rl, rlId) => {
			let parent = rl.getParent(roleId);
			if (parent) {
				rl.removeParents(parent);
			}
		});
		delete Role.ids[roleId];

		return this;
	}

	/**
	 * Check if all roleIds were added previously
	 *
	 * @param roleIds
	 * @private
	 * @throws Error - if one of roleIds does not exit
	 */
	static _checkRoleExist(...roleIds) {
		let roles = roleIds;
		if (roleIds.length == 1 & _.isArray(roleIds[0]))
			roles = roleIds[0];
		else if (roleIds.length == 1 & _.isString(roleIds[0]))
			roles = [roleIds[0]];
		for (let roleId of roles)
			if (!Role.ids[roleId])
				throw new Error(`Role ${roleId} doesn't exist`);
	}

	/**
	 * Returns
	 * @returns {string} - role Id
	 */
	toString() {
		return this.id;
	}
}

export default Role;
