const checkAuthentication = require('./check-authentication')
const render404 = require('./render-404')
const renderErrors = require('./render-errors')
const processFiles = require('./process-files')
const processUploadedFiles = require('./process-uploaded-files')

const renderBuildTime = require('./render-buildtime')
const renderDebug = require('./render-debug')
const renderNav = require('./render-nav')
const renderUsers = require('./render-users')

module.exports = {
  checkAuthentication, render404, renderErrors,
  renderBuildTime, renderDebug, renderNav,
  renderUsers, processFiles, processUploadedFiles
}
