require('jest-fetch-mock').enableMocks()
const discoverWebmentionsToSend = require('./discover-webmentions-to-send')


const htmlWithNoWebmentions = `
<p>Test test test.</p>
<p><a href="http://google.com">Google</a>.</p>
`


const htmlWithWebmentions = `
<p>Test test test.</p>
<div class="h-entry">
<p><a class="u-like-of" href="http://google.com/like">Google</a>.</p>
<p><a class="u-repost-of" href="http://google.com/repost">Google</a>.</p>
</div>
`

describe('Check negatives', () => {
  it('Fails on an empty param', async () => {
    await expect(discoverWebmentionsToSend()).rejects.toThrow('Required parameter not supplied: sourceUrl')
  })

  it('Fails on a param that\'s not a URL', async () => {
    await expect(discoverWebmentionsToSend('notWhatIShouldBe')).rejects.toThrow('Parameter must be a URL: sourceUrl')
  })

  it('Fails on a URL with no webmention data', async () => {
    fetch.mockResponseOnce(htmlWithNoWebmentions)
    await expect(discoverWebmentionsToSend('http://example.com')).rejects.toEqual(false)
  })
})


describe('Check positives', () => {
  it('Resolves an array of URLs on a URL with some webmention data', async () => {
    fetch.mockResponseOnce(htmlWithWebmentions)
    await expect(discoverWebmentionsToSend('http://example.com')).resolves.toEqual([
      'http://google.com/like', 
      'http://google.com/repost'
    ])
  })
})
