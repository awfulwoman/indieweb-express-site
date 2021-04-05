const debug = require('debug')('indieweb-express-site:controllers:content:shared:makeTweetable')
const twttr = require('twitter-text')
const trimNewlines = require('trim-newlines')
const is = require('is_js')
const isStringBlank = require('is-string-blank')

const isContentEmpty = (content) => {
  return isStringBlank(trimNewlines(content))
}

const makeTweetable = (itemObj) => {
  const tweetableIndiewebFields = ['quote_of', 'bookmark_of']
  
  // debug(itemObj)

  // If there is a Twitter content field then see if:
  // - it's a valid tweet
  // - it contains no Markdown links
  if (itemObj.twitter_content && !isContentEmpty(itemObj.twitter_content)) {
    if (twttr.parseTweet(trimNewlines(itemObj.twitter_content)).valid && !itemObj.content.includes('](')) {
      debug('trimmed twitter_content: ', trimNewlines(itemObj.twitter_content))
      debug('trimmed twitter_content length: ', trimNewlines(itemObj.twitter_content).length)
  
      // for each indieweb field
      for (const indiewebField of tweetableIndiewebFields) {
        // confirm that combined Twitter content and indieweb field is tweetable
        if (itemObj.data && itemObj.data[indiewebField]) {
          let markdownContentWithUrl = `${itemObj.twitter_content}\n ${itemObj.url}`
          if (twttr.parseTweet(markdownContentWithUrl).valid) {
            debug('twitter_content + indiewebField:', markdownContentWithUrl)
            return markdownContentWithUrl
          }
        }
      }
    }
  }


  // If there is a normal content field then see if:
  // - it's a valid tweet
  // - it contains no Markdown links
  if (itemObj.content && !isContentEmpty(itemObj.content)) {
    if (twttr.parseTweet(trimNewlines(itemObj.content)).valid && !itemObj.content.includes('](')) {
    
      debug('trimmed content: ', trimNewlines(itemObj.content))
      debug('trimmed content length: ', trimNewlines(itemObj.content).length)
  
      // for each indieweb field
      for (const indiewebField of tweetableIndiewebFields) {
        // confirm that combined content and indieweb field is tweetable
        if (itemObj.data && itemObj.data[indiewebField]) {
          // if (is.empty(trimNewlines(itemObj.content))) return
          let markdownContentWithUrl = `${itemObj.content}\n ${itemObj.url}`
          if (twttr.parseTweet(markdownContentWithUrl).valid) {
            debug('content + indiewebField:', markdownContentWithUrl)
            return markdownContentWithUrl
          }
        }
      }
    }
  }
  

  // if there is content that is tweetable then link directly to th
  // for each indieweb field
  debug('Both twitter_content and content are empty')
  for (const indiewebField of tweetableIndiewebFields) {
    // confirm that combined content and indieweb field is tweetable
    if (itemObj.data && itemObj.data[indiewebField]) {
      let markdownContent = ''
      switch (indiewebField) {
      case 'quote_of':
        markdownContent = 'I found this Tweet interesting.'
        break

      case 'bookmark_of':
        markdownContent = '🔖 ' + itemObj.data.title
        break
    
      default:
        markdownContent = `I found this URL interesting.`
        break
      }
      let markdownContentWithUrl = markdownContent + '\n\n' + itemObj.data[indiewebField]
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
