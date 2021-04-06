const debug = require('debug')('indieweb-express-site:models:utils:makeTweetable')
const twttr = require('twitter-text')
const trimNewlines = require('trim-newlines')
const isStringBlank = require('is-string-blank')
const md = require('../../utilities/markdown-it')

const isContentEmpty = (content) => {
  return isStringBlank(trimNewlines(content))
}

// Does the first object contain a property that matches one of the keys in the second array?
const relevantUrl = (resultObject, tweetableIndiewebFields) => { 
  for (const field of tweetableIndiewebFields) {
    if (resultObject.data[field] !== undefined) return {
      fieldValue: resultObject.data[field],
      fieldName: field
    }
  }
}

const addTweetableContent = (resultObject, options = {}) => {
  const tweetableIndiewebFields = ['quote_of', 'bookmark_of']

  let tweetableObj = relevantUrl(resultObject, tweetableIndiewebFields)

  // If there is a Twitter content field then see if:
  // - it's a valid tweet
  // - it contains no Markdown links
  if (resultObject.twitter_content && !isContentEmpty(resultObject.twitter_content)) {
    // debug('Found resultObject.twitter_content')
    let combined = trimNewlines(`${resultObject.twitter_content}${tweetableObj ? '\n' + tweetableObj.fieldValue : ''}`)
    if (twttr.parseTweet(combined).valid && !combined.includes('](')) {
      // debug('resultObject.twitter_content is tweetableObj')
      resultObject.twitterMarkdown = combined
      resultObject.twitterHtml = md.render(combined)
      return resultObject
    }
  }

  // If there is a normal content field then see if:
  // - it's a valid tweet
  // - it contains no Markdown links
  if (resultObject.content && !isContentEmpty(resultObject.content)) {
    // debug('Found resultObject.content')
    let combined = trimNewlines(`${resultObject.content}${tweetableObj ? '\n' + tweetableObj.fieldValue : ''}`)
    if (twttr.parseTweet(combined).valid && !combined.includes('](')) {
      // debug('resultObject.content is tweetableObj')
      resultObject.twitterMarkdown = combined
      resultObject.twitterHtml = md.render(combined)
      return resultObject
    }
  }
  

  // if there is content that is tweetableObj then link directly to th
  // for each indieweb field
  debug('Both twitter_content and content are empty')

  // confirm that combined content and indieweb field is tweetableObj
  let markdownContent = ''
  if (tweetableObj) {
    debug('tweetableObj')

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

  let combined = trimNewlines(`${markdownContent}${tweetableObj ? '\n' + tweetableObj.fieldValue : ''}`)
  if (twttr.parseTweet(combined).valid) {
    resultObject.twitterMarkdown = combined
    resultObject.twitterHtml = md.render(combined)
    return resultObject
  }

  return resultObject
}

module.exports = addTweetableContent
