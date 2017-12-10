/* eslint-disable no-tabs */
import _ from 'lodash';
import d from 'debug';
import Role from './role';
import Resource from './resource';

const debug = d('node-dynamic-acl:Acl');

/**
 * Function that will let ACL retrieve the user's "Role id".
 * This function must return a Promise
 *
 * @name fetchRoleIdFunc
 * @function
 * @param {*} user - User which Acl should retrieve Id
 * @return {Promise}
 */

/**
 * Function that will let ACL retrieve the resource's "Resource id".
 * This function must return a Promise
 *
 * @name fetchResourceIdFunc
 * @function
 * @param {*} resource - Resource which Acl should retrieve Id
 * @return {Promise}
 */

/**
 * Function that be used to check if User (with role Id) should be access
 * granted to Resource (with resource Id)
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
   * @param {fetchRoleIdFunc} roleIdFetchFunc - function that will let
   * Acl fetch Role id (default will return empty string)
   * @param {fetchResourceIdFunc} resourceIdFetchFunc - function that will
   * let Acl fetch Resource id (default will return empty string)
   */
  constructor(roleIdFetchFunc = () => new Promise(resolve => resolve('')), resourceIdFetchFunc = () => new Promise(resolve => resolve(''))) {
    this.setRoleIdFetchFunc(roleIdFetchFunc);
    this.setResourceIdFetchFunc(resourceIdFetchFunc);
    this.roles = [];
    this.resources = [];
    this.permissions = {};
  }


  /**
   * Sets how Acl should retrieve Role Id
   *
   * @param {fetchRoleIdFunc} func - that will let Acl fetch Role Id from
   * an object that may have a role
   * @returns {Acl} this instance for chaining
   */
  setRoleIdFetchFunc(func) {
    if (!_.isFunction(func)) {
      throw Error('Provided func parameter is not a function');
    }
    this._getRoleIdFunc = func;
    return this;
  }

  /**
   * Runs fetchRoleIdFunc function and returns role Id.
   *
   * @param user User which Acl should retrieve Id
   * @return {Promise}
   */
  getRoleId(user) {
    return this._getRoleIdFunc(user);
  }

  /**
   * Sets how Acl should retrieve Resource Id
   *
   * @param {fetchResourceIdFunc} func - that will let Acl fetch Resource Id
   * from an object that may be a resource
   * @returns {Acl} this instance for chaining
   */
  setResourceIdFetchFunc(func) {
    if (!_.isFunction(func)) {
      throw Error('Provided func parameter is not a function');
    }
    this._getResourceIdFunc = func;
    return this;
  }

  /**
   * Runs fetchResourceIdFunc function and returns resource Id.
   *
   * @param resource Resource which Acl should retrieve Id
   * @return {Promise}
   */
  getResourceId(resource) {
    return this._getResourceIdFunc(resource);
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
   * @param {Array.<string>|Array.<Role>} parents default is empty array
   * @returns {Acl} this instanc@e for chaining
   * @throws {Error} if role is not an instance of {@link Role} or a string
   */

  addRole(role, parents = []) {
    let roleObject = role;
    if (_.isString(role)) {
      roleObject = new Role(role, parents, this);
    }

    if (roleObject.constructor.name === 'Role') {
      this.roles.push(roleObject);
    } else {
      throw new Error(`${roleObject} is not a string nor an instance of Role so I can't add it`);
    }

    if (roleObject.getAcl() == null) {
      roleObject.setAcl(this);
    }
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
    if (role.constructor.name === 'Role') {
      roleId = role.getId();
    }
    this.roles = this.roles.filter(r => r.getId() !== roleId);
  }

  /**
   * Retrieve an instance of Role identified by id. It must be added before calling this function
   *
   * @param {string} id - of Role to retrieve
   * @returns {Role} a Role instance if it was previously added or null if not exists
   */
  getRole(id) {
    const roles = this.roles.filter(role => role.getId() === id);
    if (roles.length) {
      return roles[0];
    }
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
    const res = this.getResource(resource);
    if (!res) {
      this.resources.push(resource);
    }
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
    if (resource instanceof Resource) {
      resourceId = resource.getId();
    }
    this.resources = this.resources.filter(r => r.getId() !== resourceId);

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
    if (id instanceof Resource) {
      resourceId = id.getId();
    }
    const resources = this.resources.filter(resource => resource.getId() === resourceId);
    if (resources.length) {
      return resources[0];
    }
    return null;
  }

  /**
   * Build all permissions based on added {@link Role} and {@link Resource}.
   * Permissions are initialized
   * to allow = false and condition = null
   *
   * @returns {Acl} this instance for chaining
   */
  build() {
    const defaultPermission = {
      allowed: null,
      condition: null,
    };
    const roles = this.roles.map(role => role.getId());
    _.forEach(roles, (roleId) => {
      if (!this.permissions[roleId]) {
        this.permissions[roleId] = {};
      }
      _.forEach(this.resources, (resource) => {
        if (!this.permissions[roleId][resource.getId()]) {
          this.permissions[roleId][resource.getId()] = {};
        }
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
      privilege.map(p => this.allow(roleId, resourceId, p, condition));
      return this;
    }
    return this._allowOrDeny(true, roleId, resourceId, privilege, condition);
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
      privilege.map(p => this.deny(roleId, resourceId, p, condition));
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
    let idRole = roleId;
    let idResource = resourceId;
    if (!_.isString(idRole) && idRole.constructor.name !== 'Role') {
      throw Error(`Role must be a string or an instance of Role: ${idRole} given`);
    }
    if (!_.isString(privilege)) {
      throw Error(`privilege must be a string: ${privilege} given`);
    }
    if (condition != null && !_.isFunction(condition)) {
      throw Error(`provided condition is not a valid function: ${condition} given`);
    }
    if (idRole.constructor.name === 'Role') {
      idRole = idRole.getId();
    }
    if (idResource.constructor.name === 'Resource') {
      idResource = idResource.getId();
    }
    if (!this.getRole(idRole)) {
      throw Error(`role id: ${idRole} could not be found`);
    }
    if (!this.getResource(idResource)) {
      throw Error(`resource id: ${idResource} could not be found`);
    }
    if (!this.permissions[idRole][idResource][privilege]) {
      throw Error(`privilege ${privilege} could not be found`);
    }
    if (privilege !== '*') {
      this.permissions[idRole][idResource][privilege] = {
        allowed: allow,
        condition,
      };
    } else {
      this._allowOrDenyAll(allow, idRole, idResource);
    }
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
    let idRole = roleId;
    let idResource = resourceId;
    if (!_.isString(idRole) && idRole.constructor.name !== 'Role') {
      throw Error(`Role must be a string or an instance of Role: ${idRole} given`);
    }
    if (idRole.constructor.name === 'Role') {
      idRole = idRole.getId();
    }
    if (idResource.constructor.name === 'Resource') {
      idResource = idResource.getId();
    }
    if (!this.getRole(idRole)) {
      throw Error(`role id: ${idRole} could not be found`);
    }
    if (!this.getResource(idResource)) {
      throw Error(`resource id: ${idResource} could not be found`);
    }
    _.each(Object.keys(this.permissions[idRole][idResource]), (privilege) => {
      this.permissions[idRole][idResource][privilege] = {
        allowed: allow,
        condition: null,
      };
    });

    return this;
  }

  /**
   * Checks if user is allowed to access resource with a given privilege.
   * If yes, it checks condition
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
    return Promise.all([this._getRoleIdFunc(user), this._getResourceIdFunc(resource)]).then(
      (result) => {
        const [roleId, resourceId] = result;
        if (!_.isString(roleId)) {
          debug(`got roleId not a string: ${roleId}`);
          return Promise.reject();
        }
        if (!_.isString(resourceId)) {
          debug(`got resourceId not a string: ${roleId}`);
          return Promise.reject();
        }
        if (!this.permissions[roleId]) {
          debug(`${roleId} was not declared so I will answer that he is not allowed`);
          return Promise.reject();
        }
        if (!this.permissions[roleId][resourceId]) {
          debug(`${resourceId} was not declared so I will answer that user is not allowed to this`);
          return Promise.reject();
        }
        if (!this.permissions[roleId][resourceId][privilege] && privilege !== '*') {
          return this.isRoleAllowed(roleId, resourceId, '*');
        }

        if (_.isFunction(this.permissions[roleId][resourceId][privilege].condition)) {
          return this.isRoleAllowed(roleId, resourceId, privilege).then(
            () => this.permissions[roleId][resourceId][privilege]
              .condition(user, resource, privilege),
            () => Promise.reject(),
          );
        }
        return this.isRoleAllowed(roleId, resourceId, privilege);
      },
      (e) => {
        debug(`Error when checking ACL for user:${user} resource:${resource} privilege: ${privilege}`, e);
      },
    );
  }

  /**
   * Checks if roleId has access to resourceId with privilege.
   * If not, it will check if one of the related parents
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
      debug(`got roleId not a string: ${roleId}`);
      return Promise.reject();
    }
    if (!_.isString(resourceId)) {
      debug(`got resourceId not a string: ${roleId}`);
      return Promise.reject();
    }
    if (!this.permissions[roleId][resourceId][privilege] && privilege !== '*') {
      return this.isRoleAllowed(roleId, resourceId, '*');
    }
    const { allowed } = this.permissions[roleId][resourceId][privilege];
    // check parents if it was not defined how this role has access to this resource
    if (allowed == null) {
      return this.isAnyParentAllowed(roleId, resourceId, privilege);
    }
    return allowed ? Promise.resolve() : Promise.reject();
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
      const role = this.getRole(roleId);
      const parents = role.getParents();
      const checks = parents.map(parent => this.isRoleAllowed(parent.getId(), resourceId, privilege)
        .then(
          () => true,
          () => false,
        ));

      Promise.all(checks).then((results) => {
        results.forEach((result) => {
          if (result) {
            resolve();
          }
        });
        reject();
      });
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
    let idRole = roleId;
    if (!_.isString(idRole) && idRole.constructor.name !== 'Role') {
      throw Error(`Role must be a string or an instance of Role: ${idRole} given`);
    }
    if (idRole.constructor.name === 'Role') {
      idRole = idRole.getId();
    }
    return this.permissions[idRole];
  }
}

export default Acl;
