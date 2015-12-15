import _ from 'lodash';

let _ids = {};
let _fetchId = (resource) => resource.getId();

class Resource {
	/**
	 *
	 * @param id
	 * @param privileges
	 * @param fetchIdFunc
	 */
	constructor(id, privileges = ['*']) {
		this.privileges = [];
		this.setId(id)
			.setPrivileges(privileges);
	}

	/**
	 * Sets this resource Id
	 *
	 * @param id
	 * @returns {Resource}
	 */
	setId(id) {
		if (!_.isString(id))
			throw Error(`${id} must be a string`);
		this.id = id;
		return this;
	}

	/**
	 * Retrieve instance id
	 * @returns {string}
	 */
	getId() {
		return this.id;
	}

	/**
	 * Retrieve access privileges for this resource
	 * @returns {Array}
	 */
	getPrivileges() {
		return this.privileges;
	}

	/**
	 * Sets access privileges for this resource
	 *
	 * @param {Array} privileges
	 * @returns {Resource}
	 * @throw {Error} - if privileges is not an array of strings
	 */
	setPrivileges(privileges) {
		if (!_.isArray(privileges))
			throw Error(`privileges must be an array of strings`);
		privileges = _.union(privileges, ['*']);
		_.forEach(privileges, (privilege) => this.addPrivilege(privilege));
		return this;
	}

	/**
	 * Add an access privilege to this resource
	 *
	 * @param {string} privilege
	 * @returns {Resource}
	 * @throw {Error} - if privilege is not a string
	 */
	addPrivilege(privilege) {
		if (!_.isString(privilege))
			throw Error(`cannot add privilege ${privilege}, it must be a string`);
		if (this.privileges.indexOf(privilege) == -1)
			this.privileges.push(privilege);
		return this;
	}

	/**
	 * Removes access privilege from this resource
	 *
	 * @param {string} privilege - access privilege to remove
	 * @returns {Resource} - this instance
	 */
	removePrivilege(privilege) {
		if (!_.isString(privilege))
			throw Error(`cannot remove privilege ${privilege}, it must be a string`);
		else if (privilege == '*')
			throw Error(`You cannot remove * from access privileges`);

		let privilegeIndex = this.privileges.indexOf(privilege);
		if (privilegeIndex > -1)
			this.privileges.splice(privilegeIndex, 1);
		return this;
	}


	/**
	 * Add a new instance to Resource lists
	 * @param {Resource} resource - a new Resource to add
	 * @returns {Resource} - the new added Resource
	 * @throws {Error} - if resource is not an instance of Resource
	 * @private
	 */
	static _add(resource) {
		if (resource.constructor.name != 'Resource')
			throw Error(`You are trying to add an object that is not an instance of Resource`);

		_ids[resource.getId()] = resource;
		return _ids[resource.getId()];
	}

	/**
	 * Deletes a resource from the list
	 * @param {Resource|string} resource - to delete
	 * @returns {Resource} - static Resource
	 * @private
	 * @throws {Error} - if resource is not {Resource|string}
	 */
	static _remove(resource) {
		let resourceId = resource;
		if (resource.constructor.name == 'Resource')
			resourceId = resource.getId();
		else if (!_.isString(resource)) {
			throw Error(`Cannot remove ${resource}: it must be an instance of Resource or of type string`);
		}
		if (!_ids[resourceId])
			throw Error(`Resource ${resourceId} does not exist`);
		delete _ids[resourceId];
		return Resource;
	}

	/**
	 *
	 * @param {string} id
	 * @returns {Resource} - Resource identified by id
	 * @private
	 */
	static _get(id) {
		return _ids[id];
	}

	static _getAll() {
		return _ids;
	}
}

export default Resource;
