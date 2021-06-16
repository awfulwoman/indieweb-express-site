const debug = require('debug')('indieweb-express-site:models:users')
const users = require('../config.users')

const getAppUserObjFromExternalId = function (ExternalId, ExternalApp) {
  // users filtered down to where id matches
  // debug('getAppUserObjFromExternalId param ExternalId: ', ExternalId)
  // for each user

  debug('getAppUserFromExternalId ExternalId:', ExternalId)
  debug('getAppUserFromExternalId ExternalApp:', ExternalApp)

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    let result = user.authMethods.filter(function (authMethod) {
      return authMethod.id == ExternalId && authMethod.type === ExternalApp;
    });

    if (result.length > 0) {
      // debug('getAppUserFromExternalId valid user:', user);
      return user
    } else {
      return false
    }

  }
}

const getAppUserObjFromAppId = function (appId) {
  // debug('getAppUserObjFromAppId: ', appId)
  let result = users.filter(function (user) {
    // debug('getAppUserObjFromAppId: ', user)
    return user.id === appId;
  });

  return result[0];
}

module.exports = { getAppUserObjFromExternalId, getAppUserObjFromAppId }
