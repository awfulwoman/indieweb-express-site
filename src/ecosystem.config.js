// A config for the PM2 process manager

module.exports = {
  apps : [{
    name   : 'whalecoiner',
    script : './app.js',
    'NODE_ENV': 'production' // set up as a production server
  }]
}
