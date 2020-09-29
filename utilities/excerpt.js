const removeMarkdown = require('remove-markdown');
const isEmptyString = require('./isemptystring');


// Creates a short except from a chunk of markdown content
const excerpt = function(markdown, lines=2) {
  let removedMarkdown = removeMarkdown(markdown);
  let output = removedMarkdown.split('\n').slice(0, lines).join('\n');

  return isEmptyString(output) ? false : output;
}

module.exports = excerpt;
