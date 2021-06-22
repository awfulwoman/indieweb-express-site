const resolveEndpoint = require('./index')

describe('Check negatives', () => {
  test('Empty params', async () => {
    await expect(resolveEndpoint()).rejects.toThrow('sourceUrl must be provided')
  })

  test ('Not a URL', async () => {
    await expect(resolveEndpoint('notWhatIShouldBe')).rejects.toThrow('sourceUrl must be a URL')
  })

  test ('Localhost is not counted as a URL', async () => {
    await expect(resolveEndpoint('http://127.0.0.1')).rejects.toThrow('sourceUrl must be a URL')
  })

  test ('URL with no endpoint to discover', async () => {
    await expect(resolveEndpoint('https://example.com')).rejects.toBe(false)
  })
})
