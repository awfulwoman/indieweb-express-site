// why iconv-lite? See: https://stackoverflow.com/questions/46227783/encoding-not-recognized-in-jest-js
require('open-graph-scraper/node_modules/iconv-lite').encodingExists()
const fetchOgData = require('../fetch-opengraph-data')
const config = require('../../../../config')
const mock = require('mock-fs')
const path = require('path')

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

  let testRawFileDataPath = path.join(config.contentRoot(), 'notes/1234567890/')

  beforeEach(() => {
    mock({testRawFileDataPath})
  })


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
