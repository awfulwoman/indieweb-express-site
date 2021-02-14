const oEmbed = require('./oembed')

const dataBasic = {
    testProperty: 'testData',
}

const data1 = {
    testProperty: 'testData',
    repost_of: 'https://twitter.com/sonniesedge/status/1360936348643901440'
}

const data1Embedded = {
    testProperty: 'testData',
    repost_of: 'https://twitter.com/sonniesedge/status/1360936348643901440',
    repost_of_oembed_twitter: "<blockquote class=\"twitter-tweet\"><p lang=\"en\" dir=\"ltr\">Absolutely FANTASTIC dream last night where I was dressed as a shotgun-wielding Marie Antoinette and having to defuse bombs in a Crystal Maze type game.</p>&mdash; Charlie Don&#39;t Surf (@sonniesedge) <a href=\"https://twitter.com/sonniesedge/status/1360936348643901440?ref_src=twsrc%5Etfw\">February 14, 2021</a></blockquote>\n" +
"<script async src=\"https://platform.twitter.com/widgets.js\" charset=\"utf-8\"></script>\n"
}

const dataBad = {
    testProperty: 'testData',
    repost_of: 'notAUrl'
}

const dataExists = {
    testProperty: 'testData',
    repost_of: 'https://twitter.com/sonniesedge/status/1360936348643901440',
    repost_of_oembed_twitter: "<blockquote class=\"twitter-tweet\"><p lang=\"en\" dir=\"ltr\">Absolutely FANTASTIC dream last night where I was dressed as a shotgun-wielding Marie Antoinette and having to defuse bombs in a Crystal Maze type game.</p>&mdash; Charlie Don&#39;t Surf (@sonniesedge) <a href=\"https://twitter.com/sonniesedge/status/1360936348643901440?ref_src=twsrc%5Etfw\">February 14, 2021</a></blockquote>\n" +
    "<script async src=\"https://platform.twitter.com/widgets.js\" charset=\"utf-8\"></script>\n"
}


describe('Checking the basics', () => {
  test('No indieweb field returns the original data', async () => {
    await expect(oEmbed(dataBasic)).resolves.toEqual(dataBasic)
  })

  test('An indieweb field returns embedded data', async () => {
    await expect(oEmbed(data1)).resolves.toEqual(data1Embedded)
  })

  test('Reject badly formed indieweb field', async () => {
    await expect(oEmbed(dataBad)).rejects.toThrow('Indieweb field is not a URL')
  })

  test('Skip if oembed data already exists', async () => {
    await expect(oEmbed(dataExists)).resolves.toEqual(dataExists) // 
  })
})