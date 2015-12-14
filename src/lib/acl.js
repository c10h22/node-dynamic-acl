import _ from 'lodash';
import Role from './role';
/**
 *
 */
class Acl {
	/**
	 * Constructor
	 *
	 * @param user
	 * @param func
	 */
	constructor(user, func) {
		this.setUser(user);
		this.setUserGetRoleIdFunc(func);
	}

	/**
	 *
	 * @param user
	 */
	setUser(user) {
		this.user = user;
	}

	/**
	 *
	 * @param user
	 * @returns {*}
	 */
	getUser() {
		return this.user;
	}

	/**
	 *
	 * @param func
	 */
	setUserGetRoleIdFunc(func) {
		if (!_.isFunction(func))
			throw Error(`Provided func parameter is not a function`);
		this.getUserRoleId = func;
	}

	getUserRoleId() {
		this.getUserRoleId();
	}

	/**
	 *
	 * @param role
	 * @returns {Acl}
	 */
	addRole(role) {
		if (role.constructor.name != 'Role') {
			throw Error('role must be an instance of Role')
		}
		Role._add(role);
		return this;
	}

	/**
	 * Deletes role frol the list of declared roles
	 *
	 * @param {Role|string} role
	 * @return {Acl}
	 */
	removeRole(role) {
		Role._remove(role);
		return this;
	}

	/**
	 *
	 * @param {string} id
	 * @returns {Role}
	 */
	getRole(id) {
		return Role._get(id);
	}




}

export default Acl;
