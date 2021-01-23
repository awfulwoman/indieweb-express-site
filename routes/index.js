const archives = require('./archives')
const auth = require('./auth')
const content = require('./content')
const disambiguation = require('./disambiguation')
const offline = require('./offline')
const webmentions = require('./webmentions')
const syndication = require('./syndication')

module.exports = {
  archives, auth, content, disambiguation, offline, webmentions, syndication
}
