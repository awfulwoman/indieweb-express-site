
const tagsToArray = function(data, options = {}) {
  return data.split(options.delineator || ',').map(tag => {
    return tag.trim();
  });;
}

module.exports = tagsToArray;
