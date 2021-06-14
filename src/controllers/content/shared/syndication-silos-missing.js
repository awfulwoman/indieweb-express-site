
// Returns an array of syndication objects
// e.g. [{id: twitter}. {id: facebook}]
const syndicationSilosMissing = (silos, syndications, options = {}) => {
  const syndicated = syndications ? [...new Set(syndications.map(item => item.silo))] : []
  const missing = silos.filter(x => !syndicated.includes(x))
  const syndicationSilosMissingObj = Array.from(missing, x => {
    return { id: x }
  })
  return syndicationSilosMissingObj
}

module.exports = syndicationSilosMissing
