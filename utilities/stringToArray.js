const debug = require('debug')('indieweb-express-site:utilities:stringToArray')
const is = require('is_js')

const stringToArray = (value) => {
    debug(value)
    if (is.falsy(value)) return false
    return value.split(',').map(tag => {
        return tag.trim()
    })
}

module.exports = stringToArray