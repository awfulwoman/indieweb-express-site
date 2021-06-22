
const appRootPackage = require('app-root-path');
const path = require('path')

const appRoot = () => appRootPackage.path
const dataRoot = () => process.env['DATA_DIR'] || path.join(appRoot(), 'example', 'data')
const contentRoot = () => process.env['CONTENT_DIR'] || path.join(appRoot(), 'example', 'content')
const logDir = () => process.env['LOG_DIR'] || path.join(appRoot(), 'log')
const siteTitle = () => 'whalecoiner'
const siteDescription = () => 'Charlie and her content'
const sitePort = () => process.env['SITE_PORT'] || '3000'
const sitePortExternal = () => process.env['SITE_PORT_EXTERNAL'] || '80'
const siteProtocol = () => `${process.env['SITE_PROTOCOL'] || 'http'}://`
const siteDomain = () => `${process.env['SITE_DOMAIN'] || '127.0.0.1'}`
const siteUrl = () => `${siteProtocol()}${siteDomain()}`
const siteAuthor = () => 'Charlie Owen'
const siteLoginPath = () =>  process.env['SITE_LOGIN_PATH'] || '/login'
const fileDateFormat = () => `yyyyLLdd't'HHmmss`
const keyboardCat = () => process.env['KEYBOARD_CAT'] || 'keyboardcatgetoffyoubastard'
const twitterConsumerKey = () => process.env['TWITTER_CONSUMER_KEY']
const twitterConsumerSecret = () => process.env['TWITTER_CONSUMER_SECRET']
const githubClientId = () => process.env['GH_CLIENT_ID']
const githubClientSecret = () => process.env['GH_CLIENT_SECRET']
const silos = () => ['twitter', 'medium', 'flickr', 'facebook']
const isDevelopment = () => process.env.NODE_ENV === 'development' ? true : false

module.exports = {
  appRoot, dataRoot, contentRoot, logDir,
  siteTitle, siteDescription, sitePort, sitePortExternal, siteAuthor,
  siteProtocol, siteDomain, siteUrl, siteLoginPath, fileDateFormat,
  keyboardCat, silos, isDevelopment,
  twitterConsumerKey, twitterConsumerSecret, githubClientId, githubClientSecret
}
