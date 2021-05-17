const debug = require('debug')('indieweb-express-site:models:utils:addTwitter')
const twttr = require('twitter-text')

const { md, isContentEmpty, cleanContent, quoteSafely } = require('../../utilities')


// Does the first object contain a property that matches one of the keys in the second array?
const relevantUrl = (resultObject, tweetableIndiewebFields) => { 
  for (const field of tweetableIndiewebFields) {
    if (resultObject.data[field] !== undefined) return {
      fieldValue: resultObject.data[field],
      fieldName: field
    }
  }
}


// Add an object that contains directly tweetable content
// All sanitized and safely tweetable.
const addTweetableContent = (resultObject, options = {}) => {
  const tweetableIndiewebFields = ['quote_of', 'bookmark_of']

  let tweetableObj = relevantUrl(resultObject, tweetableIndiewebFields)

  // ---------------------------------------
  // OPTION 1. USE DEDICATED TWITTER CONTENT
  // ---------------------------------------
  // TODO: ensure that twitter_content is validated as tweetable when saving form
  // If there is a Twitter content field then see if:
  // - it's a valid tweet
  // - it contains no Markdown links
  if (resultObject.content_twitter && !isContentEmpty(resultObject.content_twitter)) {
    if (resultObject.data && resultObject.data.title) {
      let contentUrl = cleanContent(`${resultObject.content_twitter}\n${tweetableObj.fieldValue}`)
      if (twttr.parseTweet(contentUrl).valid && !contentUrl.includes('](')) {
        if (!resultObject.extended) resultObject.extended = {}
        resultObject.extended.twitter = {
          markdown: contentUrl,
          html: md.render(contentUrl)
        }
        return resultObject
      }
    }
  }

  // ---------------------------------------
  // OPTION 2. TWEET NORMAL CONTENT
  // ---------------------------------------
  // If there is a normal content field then see if:
  // - it's a valid tweet
  // - it contains no Markdown links
  if (resultObject.contentFormats && resultObject.contentFormats.markdown && !isContentEmpty(resultObject.contentFormats.markdown)) {
    // debug('Found resultObject.content')
    if (resultObject.data && resultObject.data.title) {
      let combinedContentUrlTitle = cleanContent(`${resultObject.content.markdown}\n${quoteSafely(resultObject.data.title)}${tweetableObj ? '\n' + tweetableObj.fieldValue : ''}`)
      if (twttr.parseTweet(combinedContentUrlTitle).valid && !combinedContentUrlTitle.includes('](')) {
        // debug('resultObject.content.markdown (with title)', combinedContentUrlTitle)
        resultObject.twitterFormats = {
          markdown: combinedContentUrlTitle,
          html: md.render(combinedContentUrlTitle)
        }
        return resultObject
      }
    }

    let combinedContentUrl = cleanContent(`${resultObject.content.markdown}${tweetableObj ? '\n' + tweetableObj.fieldValue : ''}`)
    if (twttr.parseTweet(combinedContentUrl).valid && !combinedContentUrl.includes('](')) {
      // debug('resultObject.content.markdown', combinedContentUrl)
      resultObject.twitterFormats = {
        markdown: combinedContentUrl,
        html: md.render(combinedContentUrl)
      }
      return resultObject
    }
  }
  
  // -----------------------------------------------------
  // OPTION 3. GENERIC TWEET POINTING TO 3RD-PARTY URL
  // -----------------------------------------------------
  // if there is content that is tweetable then link directly to th
  // for each indieweb field
  // debug('Both twitter and content are empty')

  // confirm that combinedContentUrl content and indieweb field is tweetableObj
  let markdownContent = ''
  if (tweetableObj) {
    // debug('tweetableObj')

    switch (tweetableObj.fieldName) {
    case 'quote_of':
      markdownContent = 'I found this Tweet interesting.'
      break

    case 'bookmark_of':
      markdownContent = '🔖 ' + resultObject.data.title
      break

    default:
      markdownContent = 'I found this URL interesting.'
      break
    }
  }

  let combinedContentUrl = cleanContent(`${markdownContent}${tweetableObj ? '\n' + tweetableObj.fieldValue : ''}`)
  if (twttr.parseTweet(combinedContentUrl).valid) {
    resultObject.twitterFormats = {
      markdown: combinedContentUrl,
      html: md.render(combinedContentUrl)
    }
    return resultObject
  }


  // -----------------------------------------------------
  // OPTION 4. GENERIC TWEET POINTING TO ORIGINAL ITEM
  // -----------------------------------------------------



  return resultObject
}

module.exports = addTweetableContent
