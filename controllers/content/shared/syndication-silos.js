
// Return a simple array of slios to an object of silos, including info on if the silo matches a given URL
const syndicationSilos = (silos, resolvedUrl, options = {}) => {
  return Array.from(silos, x => {
    const syndicationObj = { id: x }
    if (syndicationObj.id === 'twitter' && resolvedUrl && resolvedUrl.match('^http(s?)://twitter.com+')) {
      syndicationObj.syndicate = true
    }
    return syndicationObj
  })
}

module.exports = syndicationSilos
