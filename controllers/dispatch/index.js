const debug = require('debug')('indieweb-express-site:controllers:dispatch')
const fetch = require('node-fetch')
const is = require('is_js')
const formurlencoded = require('form-urlencoded').default

const dispatch = async (destination, payload, options = {}) => {
  try {

    console.log('Destination: ', destination)
    console.log('Payload: ', payload)
    console.log('Options: ', options)

    if (!destination) throw new Error('Required parameter not supplied: destination')
    if (!payload) throw new Error('Required parameter not supplied: payload')
    if (is.not.object(payload)) throw new Error('Parameter must be an object: payload')
    if (is.not.url(destination)) throw new Error('Parameter must be a URL: destination')

    const encodedParams = formurlencoded(payload)

    const res = await fetch(destination, {
      method: options.method || 'POST', 
      body: encodedParams,
      headers: { 'Content-type': options.contentType || 'application/x-www-form-urlencoded' }
    })

    debug('Response from remote server: ', res)

    const jsonResponse = await res.json()

    let returnObj = {
      status: res.status,
      response: jsonResponse
    }
    // if (res.statusText) returnObj.statusText = res.statusText
    // if (res.headers.location) returnObj.location = res.headers.location[0] // Hard coded for now
    // if (jsonResponse.url) returnObj.location = jsonResponse.url
    // if (jsonResponse.error) returnObj.error = jsonResponse.error

    debug('returnObj: ', returnObj)

    return returnObj
  } catch (error) {
    throw error
  }
}

module.exports = dispatch
