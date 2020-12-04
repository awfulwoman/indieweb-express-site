const debug = require('debug')('sonniesedge:controllers:webmentions:send')
const fetch = require('node-fetch')
const is = require('is_js')

const dispatch = async (destination, payload, options = {}) => {
  try {
    if (!destination) throw new Error('Required parameter not supplied: destination')
    if (!payload) throw new Error('Required parameter not supplied: payload')
    if (is.not.object(payload)) throw new Error('Parameter must be an object: payload')
    if (is.not.url(destination)) throw new Error('Parameter must be a URL: destination')

    const encodedParams = new URLSearchParams(payload)

    const res = await fetch(destination, {
      method: options.method || 'POST', 
      body: encodedParams,
      headers: { 'Content-type': options.contentType || 'x-www-form-urlencoded' }
    })

    debug(res)
   
    if (!res.ok) throw new Error(`Webmention failed with ${res.status}: ${res.statusText}`)

    let returnObj = {
      status: res.status
    }

    if (res.headers.location) returnObj.location = res.headers.location

    return returnObj
  } catch (error) {
    debug(error)
    throw error
  }
}

module.exports = dispatch
