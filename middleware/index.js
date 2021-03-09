const requireAuthentication = require('./require-authentication')
const render404 = require('./render-404')
const renderErrors = require('./render-errors')
const processFiles = require('./process-files')
const processUploadedFiles = require('./process-uploaded-files')
const session = require('./session')
const renderBuildTime = require('./render-buildtime')
const renderDebug = require('./render-debug')
const renderNav = require('./render-nav')
const renderUsers = require('./render-users')

module.exports = {
  requireAuthentication, render404, renderErrors,
  renderBuildTime, renderDebug, renderNav, session,
  renderUsers, processFiles, processUploadedFiles
}
