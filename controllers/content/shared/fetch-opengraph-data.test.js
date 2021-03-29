const fetchOgData = require('./fetch-opengraph-data')

const dataBasic = {
  testProperty: 'testData',
}

const dataBad = {
  testProperty: 'testData',
  bookmark_of: 'notAUrl'
}

const dataTwitter = {
  testProperty: 'testData',
  bookmark_of: 'https://twitter.com/sonniesedge/status/1362367533819584513'
}

const data1 = {
  testProperty: 'testData',
  storage: 'notes',
  id: 'ksjfskdfjsd',
  bookmark_of: 'https://www.bbc.com/news/science-environment-56096888'
}

describe('Checking the basics', () => {


  test('Reject indieweb fields that are not URLs', async () => {
    await expect(fetchOgData(dataBad)).rejects.toThrow('Indieweb field is not a URL')
  })

  test('Ignore twitter', async () => {
    await expect(fetchOgData(dataTwitter)).resolves.toEqual(dataTwitter)
  })

  test('Basic return', async () => {
    await expect(fetchOgData(data1)).resolves.toEqual(data1)
  })


})
