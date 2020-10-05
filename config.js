const path = require('path');
const appRoot = require('app-root-path');
const { DateTime } = require('luxon');
const uuid = require('uuid');
const validator = require('validator');
const geo = require('./utilities/form-geo');
const tags = require('./utilities/form-tags');

const config = {
  appRoot: appRoot.path,
  dataRoot: path.join(appRoot.path, 'data'),
  contentRoot: path.join(appRoot.path, 'data', 'content'),
  sitePort: process.env.SITEPORT || '3000',
  sitePortExternal: process.env.SITEPORTEXTERNAL || '80',
  siteProtocol: `${process.env['SITEPROTOCOL'] || 'http'}://`,
  siteDomain: process.env['SITEDOMAIN'] || '127.0.0.1',
  fileDateFormat: "yyyyLLdd't'HHmm"
}

module.exports = config
