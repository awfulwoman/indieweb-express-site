// A config for the PM2 process manager

module.exports = {
  apps : [{
    name   : 'Sonnie Site',
    script : './app.js',
    'NODE_ENV': 'production' // set up as a production server
  }]
}
