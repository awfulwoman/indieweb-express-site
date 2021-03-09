const fileUploads = require('./file-uploads')
const metadata = require('./metadata')
const oEmbed = require('./oembed')
const syndicationAuto = require('./syndication-auto')
const syndicationManual = require('./syndication-manual')
const formNormalizeErrors = require('./form-normalize-errors')
const formNormalizeState = require('./form-normalize-state')

module.exports = {fileUploads, metadata, syndicationAuto, syndicationManual, oEmbed, formNormalizeErrors, formNormalizeState }
