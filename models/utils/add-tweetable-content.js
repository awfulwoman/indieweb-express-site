const debug = require('debug')('indieweb-express-site:models:utils:addTweetableContent')
const twttr = require('twitter-text')

const { md, isContentEmpty, cleanContent, quoteSafely } = require('../../utilities')

const tweetableIndiewebFields = ['quote_of', 'bookmark_of']


// Does the first object contain a property that matches one of the keys in the second array?
const createIndiewebUrlObj = (resultObject, tweetableIndiewebFields) => {
  for (const field of tweetableIndiewebFields) {
    if (resultObject.data[field] !== undefined) return {
      fieldValue: resultObject.data[field],
      fieldName: field
    }
  }
  return false
}

const isTweetable = (content) => {
  return (twttr.parseTweet(content).valid && !content.includes(']('))
}



const createTweetableObj = (resultObject) => {
  let indiewebUrlObj = createIndiewebUrlObj(resultObject, tweetableIndiewebFields)
  let url = indiewebUrlObj.fieldValue

  // ---------------------------------------
  // OPTION 1. USE DEDICATED TWITTER CONTENT + indieweb URL)
  // ---------------------------------------
  // TODO: ensure that twitter_content is validated as tweetable when saving form
  // If there is a Twitter content field then see if:
  // - it's a valid tweet
  // - it contains no Markdown links

  if (indiewebUrlObj && resultObject.content_twitter && !isContentEmpty(resultObject.content_twitter)) {
    // If there is separate content then link directly to this item's URL, not to the remote indieweb URL.
    if (!isContentEmpty(resultObject.content)) url = resultObject.url
    let content = cleanContent(`${resultObject.content_twitter}\n${url}`)
    if (isTweetable(content)) {
      return {
        markdown: content,
        html: md.render(content),
        plain: content,
        generatedFrom: 'TWITTER_CONTENT'
      }
    }
  }


  // ---------------------------------------
  // OPTION X. USE DEDICATED TWITTER CONTENT
  // ---------------------------------------
  // TODO: ensure that twitter_content is validated as tweetable when saving form
  // If there is a Twitter content field then see if:
  // - it's a valid tweet
  // - it contains no Markdown links
  if (resultObject.content_twitter && !isContentEmpty(resultObject.content_twitter)) {
    let contentTwitter = cleanContent(resultObject.content_twitter)
    if (isTweetable(contentTwitter)) {
      return {
        markdown: contentTwitter,
        html: md.render(contentTwitter),
        plain: contentTwitter,
        generatedFrom: 'TWITTER_CONTENT'
      }
    }
  }

  // ---------------------------------------
  // OPTION X. TWEET NORMAL CONTENT + indieweb URL < 280 chars
  // ---------------------------------------
  // If there is a normal content field then see if:
  // - it's a valid tweet
  // - it contains no Markdown links
  if (indiewebUrlObj && resultObject.content && !isContentEmpty(resultObject.content)) {
    let cleanContentTitleUrl = cleanContent(`${resultObject.content}${resultObject.type === 'bookmark' ? quoteSafely(resultObject.data.title) : ''}\n${url}`)
    let cleanContentUrl = cleanContent(`${resultObject.content}${url ? '\n' + url : ''}`)

    // If it can be tweeted with the content, the item title intact, and a URL, then do so
    if (isTweetable(cleanContentTitleUrl)) {
      return {
        markdown: cleanContentTitleUrl,
        html: md.render(cleanContentTitleUrl),
        plain: cleanContentTitleUrl,
        generatedFrom: 'CONTENT'
      }
    }

    // If it can be tweeted with the content and URL, then do so
    if (isTweetable(cleanContentUrl)) {
      return {
        markdown: cleanContentTitleUrl,
        html: md.render(cleanContentTitleUrl),
        plain: cleanContentTitleUrl,
        generatedFrom: 'CONTENT'
      }
    }
  }

  // ---------------------------------------
  // OPTION X. TWEET NORMAL CONTENT < 280 chars
  // ---------------------------------------
  // If there is just a regular old content field then see if:
  // - it's a valid tweet
  // - it contains no Markdown links
  if (resultObject.content && !isContentEmpty(resultObject.content)) {
    let normalContent = cleanContent(resultObject.content)
    if (isTweetable(normalContent)) {
      return {
        markdown: normalContent,
        html: md.render(normalContent),
        plain: normalContent,
        generatedFrom: 'CONTENT'
      }
    }
  }


  // -----------------------------------------------------
  // OPTION 4. GENERIC TWEET POINTING TO 3RD-PARTY URL
  // -----------------------------------------------------
  let genericContent = ''
  if (indiewebUrlObj) {
    switch (indiewebUrlObj.fieldName) {
      case 'quote_of':
        genericContent = 'I found this Tweet interesting.'
        break

      case 'bookmark_of':
        genericContent = '🔖 ' + resultObject.data.title
        break

      default:
        genericContent = 'I found this URL interesting.'
        break
    }
  }

  let combinedContentUrl = cleanContent(`${genericContent}${indiewebUrlObj ? '\n' + indiewebUrlObj.fieldValue : ''}`)
  if (isTweetable(combinedContentUrl)) {
    return {
      markdown: combinedContentUrl,
      html: md.render(combinedContentUrl),
      plain: combinedContentUrl,
      generatedFrom: 'FALLBACK'
    }
  }


  // -----------------------------------------------------
  // OPTION 5. GENERIC TWEET POINTING TO ORIGINAL ITEM?
  // -----------------------------------------------------

  let fallbackContent = `I posted something, dickheads.\n${resultObject.url}`
  return {
    markdown: fallbackContent,
    html: md.render(fallbackContent),
    plain: fallbackContent,
    generatedFrom: 'FINAL_FALLBACK'
  }

}


// Add an object that contains directly tweetable content
// All sanitized and safely tweetable.
const addTweetableContent = (resultObject, options = {}) => {
  let result = createTweetableObj(resultObject)

  if (!result) return resultObject

  if (!resultObject.extended) resultObject.extended = {}
  resultObject.extended.twitter = result

  return resultObject
}

module.exports = addTweetableContent
