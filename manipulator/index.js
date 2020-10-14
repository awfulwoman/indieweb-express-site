require('dotenv').config()
const debug = require('debug')('sonniesedge:manipulator');
// const fs = require('fs')


(async function () {
  const config = require('../config')
  const fg = require('fast-glob')
  const path = require('path')
  
  try {
    let result = await fg(path.join(config.contentRoot, '**', 'index.md'))
    console.log(result)
  } catch (error) {
    console.log(`There was an error globbing for files`, error)
    // throw error
  }
}());
