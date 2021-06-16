const archives = require('./archives')
const auth = require('./auth')
const content = require('./content')
const disambiguation = require('./disambiguation')
const feeds = require('./feeds')
const offline = require('./offline')
const webmentions = require('./webmentions')
const syndication = require('./syndication')

module.exports = {
  feeds, archives, auth, content, disambiguation, offline, webmentions, syndication
}
