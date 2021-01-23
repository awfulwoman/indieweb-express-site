const siloFromUrl = require('./silo-from-url')

describe('Checking parameters', () => {
  test('silo from twitter status URL', () => {
    expect(siloFromUrl('https://twitter.com/sonniesedge/status/1333733896316473346')).toEqual('twitter')
  })

  test('silo from twitter domain', () => {
    expect(siloFromUrl('twitter.com')).toEqual('twitter')
  })
})
