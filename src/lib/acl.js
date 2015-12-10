import Sequelize from 'sequelize';
class Acl {

	constructor(options) {
		this.roles = {} || options.roles;
		this.resources = {} || options.resources;
		this.acls = {} || options.acls;
	}

	/**
	 * Add a role to ACL
	 * @param roleId - String representing role
	 * @param parents - Array of strings must be declared before
	 * @returns {Acl} - this instance
	 */
	addRole(roleId, parents = null) {
		if (Array.isArray(parents)) {
			for (let parent of parents) {
				if (!this.roles[parent])
					throw new Error(`parent roleId ${parent} does not exist for ${roleId}`);
			}
			this.roles[roleId] = parents;
		}
		else if (parents == null) {
			this.roles[roleId] = [];
		}
		return this;
	}

	removeRole(roleId) {
		if (this.roles[roleId])
			delete this.roles[roleId];
		else {
			throw Error(`cannot remove roleId ${roleId}:  does not exist`);
		}
	}

	/**
	 * Add a Sequelize Model as a resource with its associated previleges
	 *
	 * @param resource - instance of Sequelize.Model
	 * @param privileges  - Array of text representing privileges
	 * @returns {Acl} - this instance
	 */
	addModelResource(resource, privileges) {
		this.resources[resource.getTableName()] = {
			model: resource,
			privileges: privileges
		};
		return this;
	}

	/**
	 * Add a resource with its associated previleges
	 * @param resource - instance of Sequelize.Model
	 * @param privileges - Array of text representing privileges default is ['*']
	 * @returns {Acl} - this instance
	 */
	addResource(resource, privileges = ['*']) {
		if (Acl.isSequelizeModel(resource))
			this.addModelResource(resource, privileges);
		return this;
	}

	_sanityRoleModelOperation(roleId, resource, privilege) {
		let myResource = this.resources[resource.getTableName()];
		let myRole = this.roles[roleId];
		if (!myResource) {
			throw Error(`resource ${resource.getTableName()} was not declared`);
		}
		if (!myRole) {
			throw Error(`role ${roleId} was not declared`);
		}

		if (privilege && myResource.privileges.indexOf(privilege) == -1)
			throw Error(`privilege ${privilege} was not declared within resource ${resource.getTableName()}`);

		if (!this.acls[roleId]) {
			this.acls[roleId] = {};
		}
		if (!this.acls[roleId][resource.getTableName()]) {
			this.acls[roleId][resource.getTableName()] = {};
		}
		return myResource;
	}

	_allowDenyResourcePrivilege(roleId, resource, myResource, privilege, assertion, allow) {
		if (privilege)
			this.acls[roleId][resource.getTableName()][privilege] = {
				allow: allow,
				assert: assertion
			};
		else
			for (let resourcePrivilege of myResource.privileges) {
				this.acls[roleId][resource.getTableName()][resourcePrivilege] = {
					allow: !allow,
					assert: undefined
				};

			}
	}

	allowRoleModel(roleId, resource, privilege, assertion) {
		let myResource = this._sanityRoleModelOperation(roleId, resource, privilege);
		this._allowDenyResourcePrivilege(roleId, resource, myResource, privilege, assertion, true);
		return this;
	}

	denyRoleModel(roleId, resource, privilege, assertion) {
		let myResource = this._sanityRoleModelOperation(roleId, resource, privilege);
		this._allowDenyResourcePrivilege(roleId, resource, myResource, privilege, assertion, false);
		return this;
	}

	allow(roleId, resource, privilege, assertion) {
		if (Acl.isSequelizeModel(resource))
			return this.allowRoleModel(roleId, resource, privilege, assertion);
		return this;
	}

	deny(roleId, resource, privilege, assertion) {
		if (Acl.isSequelizeModel(resource))
			return this.denyRoleModel(roleId, resource, privilege, assertion);
		return this;
	}

	isParentsAllowed(roleId, user, resource, privilege) {
		console.log('isParentsAllowed', roleId);
		let parentsRole = this.getParents(roleId);
		if (parentsRole.length == 0)
			return false;
		else {
			let isAllowed = false;
			for (let parentRole of parentsRole) {
				isAllowed = isAllowed || this.isRoleAllowed(parentRole, user, resource, privilege);
			}
			return isAllowed;
		}
	}

	isRoleAllowed(roleId, user, resource, privilege) {
		let myRole = this.acls[roleId];
		if (!myRole)
			return this.isParentsAllowed(roleId, user, resource, privilege);

		let myResource = myRole[resource.Model.getTableName()];
		if (!myResource) {
			return this.isParentsAllowed(roleId, user, resource, privilege);

		} else {
			let myPrivilege = myResource[privilege];
			let allPrivilege = myResource['*'];
			if (!myPrivilege && allPrivilege) {
				return allPrivilege.allow;
			} else if (!myPrivilege) {
				return this.isParentsAllowed(roleId, user, resource, privilege);
			} else if (myPrivilege.assert) {
				if (myPrivilege.allow) return myPrivilege.assert(user, resource);
				else if (myPrivilege.assert(user, resource)) return false;
			} else {
				return myPrivilege.allow;
			}
		}
	}

	isAllowed(user, resource, privilege) {
		return this.isRoleAllowed(user.getRoleId(), user, resource, privilege);
	}

	getParents(roleId) {
		return this.roles[roleId].map((parent) => {
			return parent;
		});
	}

	static isSequelizeModel(model) {
		return (model instanceof Sequelize.Model);
	}
}

export default Acl;
