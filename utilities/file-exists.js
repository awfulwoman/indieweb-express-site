const fs = require('fs')

async function fileExists(file) {
  return fs.promises.access(file, fs.constants.F_OK)
    .then(() => true)
    .catch(() => false)
}

module.exports = fileExists
