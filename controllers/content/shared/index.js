const fileUploads = require('./file-uploads')
const metadata = require('./metadata')
const oEmbed = require('./oembed')
const fetchOpengraphData = require('./fetch-opengraph-data')
const syndicationAuto = require('./syndication-auto')
const syndicationManual = require('./syndication-manual')
const flattenFormErrors = require('./flatten-form-errors')
const flattenFormBody = require('./flatten-form-body')
const syndicationSilos = require('./syndication-silos')
const syndicationSilosMissing = require('./syndication-silos-missing')

module.exports = {
  fileUploads,
  metadata,
  syndicationAuto,
  syndicationManual,
  oEmbed,
  fetchOpengraphData,
  flattenFormErrors,
  flattenFormBody,
  syndicationSilos,
  syndicationSilosMissing
}
