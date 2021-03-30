const fetchOgData = require('./fetch-opengraph-data')

const id = '1234567890'

const model = {
  modelDir: 'notes',
  id: 'note'
}

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
    await expect(fetchOgData(dataBad, model, id)).rejects.toThrow('Indieweb field does not contain a URL')
  })

  test('Ignore twitter', async () => {
    await expect(fetchOgData(dataTwitter, model, id)).resolves.toEqual(dataTwitter)
  })

  test('Basic return', async () => {
    await expect(fetchOgData(data1, model, id)).resolves.toEqual(data1)
  })


})
