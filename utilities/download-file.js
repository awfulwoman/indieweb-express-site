const Downloader = require('nodejs-file-downloader')

const downloadFile = async (url, destinationDir = '/tmp') => {
  const downloader = new Downloader({
    url: url,
    directory: destinationDir
  })
  await downloader.download()
}

module.exports = downloadFile
