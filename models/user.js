const e = require('express');
const users = require('../config.users');

const getAppUserObjFromExternalId = function(ExternalId, ExternalApp) {
  // users filtered down to where id matches
  // console.log('getAppUserObjFromExternalId param ExternalId: ', ExternalId)
  // for each user

  console.log('getAppUserFromExternalId ExternalId:', ExternalId);
  console.log('getAppUserFromExternalId ExternalApp:', ExternalApp);

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    let result = user.authMethods.filter(function (authMethod) {
      return authMethod.id == ExternalId && authMethod.type === ExternalApp;
    });

    if (result.length > 0) {
      console.log('getAppUserFromExternalId valid user:', user);
      return user
    } else {
      return false
    }
    
  }
}

const getAppUserObjFromAppId = function(appId) {
  console.log('getAppUserObjFromAppId: ', appId)
  let result = users.filter(function (user) {
    console.log('getAppUserObjFromAppId: ', user)
    return user.id === appId;
  });

  return result[0];
}

module.exports = { getAppUserObjFromExternalId, getAppUserObjFromAppId }
