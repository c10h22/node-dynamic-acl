import _ from 'lodash';

let _ids = {};
/**
 * Role class
 */
class Role {

	/**
	 * Creates a new role and attach it to Acl
	 * @param {string} id role's id
	 * @param {Array.<string>|Array.<Role>} parents list of parents
	 * @param {Acl} acl ACL to which this role will be attached
	 * @throws {Error} if acl is not an instance of {Acl} or given parents were not declared before
	 */
	constructor(id, parents = [], acl = null) {
		this.setId(id);
		if (acl)
			this.setAcl(acl);
		this.setParents(parents);
	}

	/**
	 * Sets the ACL to which this role will be attached
	 *
	 * @param {Acl} acl
	 */
	setAcl(acl) {
		if (acl.constructor.name != 'Acl')
			throw new Error(`Provided ACL for role ${this.id} is not an instance of Acl`);
		this.acl = acl;
	}

	/**
	 * Returns the ACL to which this role is attached
	 *
	 * @returns {Acl|*}
	 */
	getAcl() {
		return this.acl;
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
			throw new Error(`Role ${id} cannot be renamed: roleId must be a string`);
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
	 * @param {Array.<string>|Array.<Role>|null} parents - Role parents: must be declared as individual roles before
	 * @returns {Role} this instance for chaining
	 * @throws {Error} if one of the given parents was not declared before
	 */
	setParents(parents) {
		this.parents = [];
		for (let parent of parents) {
			this.addParent(parent);
		}
		return this;
	}

	/**
	 * Returns parents roles of this instance
	 *
	 * @returns {Array|Array.<Role>}
	 */
	getParents() {
		return this.parents;
	}

	/**
	 * Get a parent from this role
	 *
	 * @param {Role|string} role id or role instance to retrieve
	 * @returns {Role|null} null if parent role was not found
	 */
	getParent(role) {
		let roleId = role;
		if (role.constructor.name == 'Role')
			roleId = role.getId();
		let parents = this.getParents().filter((parent) => parent.getId() == roleId);
		if (parents.length)
			return parents[0];
		return null;

	}

	/**
	 * Add parent to this role. If it already exists in parents list, it will be replaced
	 *
	 * @param {Role|string} role Parent Role instance of its id
	 * @return {Role} this instance for chaining
	 * @throws {Error} if no Acl was attached to this role or if parent was not declared previously
	 */
	addParent(role) {
		if (this.getAcl() == null)
			throw new Error(`You must attach an ACL to this role before adding parents`);

		role = this.getAcl().getRole(role);
		if (!role)
			throw new Error(`You are trying to add ${role} as parent to ${this.id} but it was not declared previously`);
		if (this.getParent(role))
			this.removeParent(role);
		this.parents.push(role);
		return this
	}

	/**
	 * Add an array of parents role to this instance
	 *
	 * @param {Array.<Role>|Array.<string>} roles to add as parents to this instance
	 * @throws {Error} if no Acl was attached to this role or if one parent was not declared previously
	 * @return {Role} this instance for chaining
	 */
	addParents(roles) {
		for (let role of roles)
			this.addParent(role);
		return this;
	}

	/**
	 * Remove a parent from the list of this role's parents
	 *
	 * @param {Role|string] role Parent role isntance or its role id
	 * @returns {Role} this instance for chaining
	 */
	removeParent(role) {
		let roleId = role;
		if (role.constructor.name == 'Role')
			roleId = role.getId();

		this.parents = this.parents.filter((parent) => parent.getId() != roleId);
		return this;
	}

	/**
	 * Remove a role from parent list
	 *
	 * @param {Array.<string>|Array.<Role>} roles to remove from parents list
	 * @return {Role} this instance for chaining
	 */
	removeParents(roles) {
		for (let role of roles)
			this.removeParent(role);
		return this;
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
