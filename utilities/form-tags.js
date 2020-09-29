
const tagsToArray = function(data) {
  return data.split(',').map(tag => {
    return tag.trim();
  });;
}

module.exports = tagsToArray;
