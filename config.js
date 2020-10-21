
const appRoot = require('app-root-path');

const config = {
  appRoot: appRoot.path,
  dataRoot: process.env['DATAROOT'],
  contentRoot: process.env['CONTENTROOT'],
  siteTitle: 'sonniesedge',
  siteDescription: 'Charlie Owen and her owned content',
  sitePort: process.env['SITEPORT'] || '3000',
  sitePortExternal: process.env['SITEPORTEXTERNAL'] || '80',
  siteProtocol: `${process.env['SITEPROTOCOL'] || 'http'}://`,
  siteDomain: process.env['SITEDOMAIN'] || '127.0.0.1',
  siteUrl: `${this.siteProtocol}/${this.siteDomain}`,
  fileDateFormat: "yyyyLLdd't'HHmm",
}

module.exports = config
