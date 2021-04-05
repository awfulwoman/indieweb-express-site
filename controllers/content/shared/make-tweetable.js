const debug = require('debug')('indieweb-express-site:controllers:content:shared:makeTweetable')
const twttr = require('twitter-text')
const trimNewlines = require('trim-newlines')

const makeTweetable = (itemObj) => {
  const tweetableIndiewebFields = ['quote_of', 'bookmark_of']
  
  // debug(itemObj)

  // If there is a Twitter content field then see if:
  // - it's a valid tweet
  // - it contains no Markdown links
  if (itemObj.twitter_content && twttr.parseTweet(trimNewlines(itemObj.twitter_content)).valid && !itemObj.content.includes('](')) {
    // for each indieweb field
    for (const indiewebField of tweetableIndiewebFields) {
      // confirm that combined Twitter content and indieweb field is tweetable
      if (itemObj.data && itemObj.data[indiewebField]) {
        let markdownContentWithUrl = `${itemObj.twitter_content}\n ${itemObj.data[indiewebField]}`
        if (twttr.parseTweet(markdownContentWithUrl).valid) {
          debug('twitter_content + indiewebField:', markdownContentWithUrl)
          return markdownContentWithUrl
        }
      }
    }
  }

  // If there is a normal content field then see if:
  // - it's a valid tweet
  // - it contains no Markdown links
  if (itemObj.content && twttr.parseTweet(trimNewlines(itemObj.content)).valid && !itemObj.content.includes('](')) {
    // for each indieweb field
    for (const indiewebField of tweetableIndiewebFields) {
      // confirm that combined content and indieweb field is tweetable
      if (itemObj.data && itemObj.data[indiewebField]) {
        let markdownContentWithUrl = `${itemObj.content}\n ${itemObj.data[indiewebField]}`
        if (twttr.parseTweet(markdownContentWithUrl).valid) {
          debug('content + indiewebField:', markdownContentWithUrl)
          return markdownContentWithUrl
        }
      }
    }
  }

  // if there is content that is tweetable then link directly to th
  // for each indieweb field
  for (const indiewebField of tweetableIndiewebFields) {
    // confirm that combined content and indieweb field is tweetable
    if (itemObj.data && itemObj.data[indiewebField]) {
      let markdownContent = ''
      switch (indiewebField) {
      case 'quote_of':
        markdownContent = 'I found this Tweet interesting.'
        break

      case 'bookmark_of':
        markdownContent = '🔖 Bookmarked!'
        break
    
      default:
        markdownContent = `I found this URL interesting.`
        break
      }
      let markdownContentWithUrl = markdownContent + '\n\n' + indiewebField
      if (twttr.parseTweet(markdownContentWithUrl).valid) {
        debug('indiewebField:', markdownContentWithUrl)
        return markdownContentWithUrl
      } else {
        debug('Not valid so only sending indiewebField:', markdownContentWithUrl)
        return indiewebField
      }
    }
  }

}

module.exports = makeTweetable
