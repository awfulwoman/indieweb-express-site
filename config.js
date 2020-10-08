
const appRoot = require('app-root-path');

const config = {
  appRoot: appRoot.path,
  dataRoot: process.env['DATAROOT'],
  contentRoot: process.env['CONTENTROOT'],
  sitePort: process.env['SITEPORT'] || '3000',
  sitePortExternal: process.env['SITEPORTEXTERNAL'] || '80',
  siteProtocol: `${process.env['SITEPROTOCOL'] || 'http'}://`,
  siteDomain: process.env['SITEDOMAIN'] || '127.0.0.1',
  fileDateFormat: "yyyyLLdd't'HHmm",
}

module.exports = config
