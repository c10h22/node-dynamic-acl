import _ from 'lodash';

class Resource {
  /**
   * Constructor
   *
   * @param {string} id - of this Resource
   * @param {Array.<string>} privileges access privileges for this resource
   * @trows {Error} if privileges is not an Array of strings
   */
  constructor(id, privileges = ['*']) {
    this.privileges = [];
    this.setId(id)
      .setPrivileges(privileges);
  }

  /**
   * Sets this resource Id
   *
   * @param id {string}
   * @returns {Resource} instance for chaining
   * @throws {Error} if id is not a string
   */
  setId(id) {
    if (!_.isString(id)) { throw Error(`${id} must be a string`); }
    this.id = id;
    return this;
  }

  /**
   * Retrieve resource id
   *
   * @returns {string} id of this resource
   */
  getId() {
    return this.id;
  }

  /**
   * Retrieve access privileges for this resource
   *
   * @returns {Array.<string>} Array of access privileges
   */
  getPrivileges() {
    return this.privileges;
  }

  /**
   * Sets access privileges for this resource
   *
   * @param {Array.<string>} privileges to set
   * @throws {Error} if privileges is not an array of strings
   * @returns {Resource}
   */
  setPrivileges(privileges) {
    let privs = privileges;
    if (!_.isArray(privs)) { throw Error('privileges must be an array of strings'); }
    privs = _.union(privs, ['*']);
    _.forEach(privs, privilege => this.addPrivilege(privilege));
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
    if (!_.isString(privilege)) { throw Error(`cannot add privilege ${privilege}, it must be a string`); }
    if (this.privileges.indexOf(privilege) === -1) { this.privileges.push(privilege); }
    return this;
  }

  /**
   * Removes access privilege from this resource
   *
   * @param {string} privilege - access privilege to remove
   * @returns {Resource} - this instance
   */
  removePrivilege(privilege) {
    if (!_.isString(privilege)) {
      throw Error(`cannot remove privilege ${privilege}, it must be a string`);
    } else if (privilege === '*') {
      throw Error('You cannot remove * from access privileges');
    }

    const privilegeIndex = this.privileges.indexOf(privilege);
    if (privilegeIndex > -1) { this.privileges.splice(privilegeIndex, 1); }
    return this;
  }
}

export default Resource;
