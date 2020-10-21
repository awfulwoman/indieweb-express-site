const config = require('../config')
const passport = require('passport')
const TwitterStrategy = require('passport-twitter').Strategy
// const GitHubStrategy = require('passport-github2').Strategy;


const constructOauthCallbackUrl = function (strategy) {
  let result = `${config.siteProtocol()}${config.siteDomain()}${(config.sitePortExternal() && config.sitePortExternal() != 80 ? ':' + config.sitePortExternal() : '')}/login/${strategy}/callback`;
  return result;
}


// Set options
const passportTwitterOptions = {
  consumerKey: process.env['TWITTER_CONSUMER_KEY'],
  consumerSecret: process.env['TWITTER_CONSUMER_SECRET'],
  callbackURL: constructOauthCallbackUrl('twitter')
};

// const passportGithubOptions = {
//   clientID: process.env['GITHUB_CLIENT_ID'],
//   clientSecret: process.env['GITHUB_CLIENT_SECRET'],
//   callbackURL: constructOauthCallbackUrl('github')
// }

// Use Twitter passport strategy
passport.use(new TwitterStrategy(passportTwitterOptions, function (token, tokenSecret, profile, cb) {
  debug('Someone trying to login with following Twitter profile: ', profile.username);
  let appUserProfile = users.getAppUserObjFromTwitterId(profile.id);
  return cb(null, appUserProfile);
}));

// Use Github passport strategy
// passport.use(new GitHubStrategy(passportGithubOptions, function(accessToken, refreshToken, profile, cb) {
//   // debug(passportGithubOptions)
//   // debug('Passport Github profile:', profile);
//   return cb(null, profile);
// }));

// Configure Passport authenticated session persistence.
passport.serializeUser(function (userAppObj, callback) {
  // serialize into session token - only need to store user ID in here
  callback(null, userAppObj.id);
});

passport.deserializeUser(function (userAppId, callback) {
  // deserialize out of session token and into a full user object
  callback(null, users.getAppUserObjFromAppId(userAppId));
});

module.exports = passport
