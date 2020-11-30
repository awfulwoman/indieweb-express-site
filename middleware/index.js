const checkAuthentication = require('./check-authentication')
const handle404 = require('./handle-404')
const handleErrors = require('./handle-errors')
const renderBuildTime = require('./render-buildtime')
const renderDebug = require('./render-debug')
const renderNav = require('./render-nav')
const renderUsers = require('./render-users')

module.exports = {
  checkAuthentication, handle404, handleErrors,
  renderBuildTime, renderDebug, renderNav,
  renderUsers
}
