const debug = require('debug')('indieweb-express-site:controllers:content:shared:fetchTwitterSvg')
const Twitter = require('twitter-lite')
const tweet2svg = require('@whalecoiner/tweet2svg')
const path = require('path')
const { createWriteStream } = require('fs')
const { pipeline } = require('stream')
const { promisify } = require('util')
const is = require('is_js')

const mkdir = require('mkdirp')
const imageSize = require('image-size')

const config = require('../../../config')

const imageSizePromise = promisify(imageSize)
const streamPipeline = promisify(pipeline)


const fetchTwitterSvg = async (data, renderMessages = [], options = {}) => {
  try {
    const indiewebFields = ['like_of', 'repost_of', 'quote_of']

    const user = new Twitter({
      consumer_key: process.env.TWITTER_CONSUMER_KEY,
      consumer_secret: process.env.TWITTER_CONSUMER_SECRET
    });

    const response = await user.getBearerToken()
    const app = new Twitter({
      bearer_token: response.access_token
    })

    // debug('app: ', app)

    const tweetData = await app.get('statuses/show', {
      id: '1371873345713627137',
      tweet_mode: 'extended'
    })

    // debug('tweetData: ')
    // debug(tweetData)

    if (!tweetData.id_str) throw new Error('Could not get details for this tweet')

    const tweet = await tweet2svg(tweetData)

    // debug('svg tweet: ')
    // debug(tweet)

    for (const field of indiewebFields) {
      // if the current field is a field in data
      if (Object.keys(data).includes(field)) {
        let currentUrl = data[field]
        if (is.not.url(currentUrl)) throw new Error('Indieweb field is not a URL')
        if (currentUrl.match('^http(s?)://twitter.com+')) return data // don't try this on twitter

        // Get data
        // Fetch Tweet
        // const tweetData = await app.get('statuses/show/1372140685449699329')
        // if (!tweetData.id_str) throw new Error('Could not get details for this tweet')

        // debug(tweetData)

        // const tweet = await tweet2svg(tweetData)

        // debug(tweet)


        // renderMessages.push('Added OG data for ' + currentUrl)
      }
    }

    // return data
    return tweet
  } catch (error) {
    console.log(error)
    throw error
  }
}

module.exports = fetchTwitterSvg
