import twttr from 'twitter-text'
import MarkdownIt from 'markdown-it'
import MarkdownItRegexp from 'markdown-it-regexp'
let replacer = MarkdownItRegexp(
  // regexp to match
  /(^|[^@\w])@(\w{1,15})\b/g,

  // this function will be called when something matches
  function(match, utils) {
    var url = 'https://twitter.com/' + match[2]
    console.log('match:', utils.escape(match[2]))
    return `<a href="${utils.escape(url)}">@${utils.escape(match[2])}</a>`
  }
)
let md = MarkdownIt().use(replacer)


const source = document.getElementById('content')

const inputHandler = function(e) {
  let sourceTxt = e.target.value
  // let markdown = md.render(e.target.value)
  // var result = twttr.parseTweet(markdown)
  var arrayOfLines = sourceTxt.split("\n")
  let toParse = []

  arrayOfLines.forEach(line => {
    console.log('line:', line)
    let parsed = md.renderInline(line)
    toParse.push(parsed)
  })

  var result = twttr.parseTweet(toParse.join('\n'))
  if (result.valid === false) document.getElementById('tweetable').textContent = 'false'
  if (result.valid === true) document.getElementById('tweetable').textContent = 'true'
  console.log(toParse.join('\n'))
  // console.log(result)
}

source.addEventListener('input', inputHandler);


