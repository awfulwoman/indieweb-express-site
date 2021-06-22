const clacksOverhead = (req, res, next) => {
  res.header('X-Clacks-Overhead', 'GNU Terry Pratchett')
  next()
}
  
module.exports = clacksOverhead
  