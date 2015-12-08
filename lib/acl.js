/**
 * Wistiki SAS
 * Created by adnene on 08/12/2015.
 */
class Acl {

	constructor(options) {
		this.roles = {} || options.roles;
		this.resources = {} || options.resources;
	}

	addRole(roleId, parents = null) {
		if (Array.isArray(parents)) {
			parents.map((parent) => {
				if (!this.roles[parent])
					throw new Error('parent does not exit');
			});
			this.roles[roleId] = parents;
		}
		else if (parents == null) {
			this.roles[roleId] = [];
		} else {
			throw Error('parents must be an Array');
		}
	}

	addResource(resource, parents = null) {
		if (Array.isArray(parents)) {
			parents.map((parent) => {
				if (!this.resources[parent])
					throw new Error('parent does not exist');
			});
			this.resources[resourceId] = parents;
		}
		else if (parents == null) {
			this.resources[resourceId] = [];
		} else {
			throw Error('parents must be an Array');
		}
	}
}

export default Acl;
