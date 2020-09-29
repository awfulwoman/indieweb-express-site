const e = require('express');
const users = require('../config.users');

const getAppUserObjFromTwitterId = function(twitterId) {
  // users filtered down to where id matches
  // console.log('getAppUserObjFromTwitterId param twitterId: ', twitterId)
  // for each user

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    let result = user.authMethods.filter(function (authMethod) {
      return authMethod.id == twitterId && authMethod.type === 'twitter';
    });

    if (result.length > 0) {
      // console.log('getAppUserFromTwitterId valid user:', user);
      return user
    } else {
      return false
    }
    
  }
}

const getAppUserObjFromAppId = function(appId) {
  // console.log('getAppUserObjFromAppId: ', appId)
  let result = users.filter(function (user) {
    // console.log('getAppUserObjFromAppId: ', user)
    return user.id === appId;
  });

  return result[0];
}

const getAppUserIdFromTwitterUsername = function(twitterUsername) {
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    let result = user.authMethods.filter(function (authMethod) {
      return authMethod.username == twitterUsername && authMethod.type === 'twitter';
    });

    if (result.length > 0) {
      return user
    } else {
      return false
    }
    
  }
}

module.exports = {
  getAppUserObjFromTwitterId,
  getAppUserObjFromAppId,
  getAppUserIdFromTwitterUsername
}
