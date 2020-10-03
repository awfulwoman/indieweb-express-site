const outdent = require('outdent')

const markdownFile = (meta, content) => {
  outdent`---
  ${YAML.safeDump(meta)}
  ---

  ${content}
  `;
}

module.exports = markdownFile
