(async function () {
  require('dotenv').config()
  const debug = require('debug')('sonniesedge:manipulator');
  const config = require('./config')
  const fg = require('fast-glob')
  const path = require('path')
  const { models } = require('./models')

  // debug(config)
  // debug(process.env)

  try {

    for (const model of models) {
      // model = models.models.like
      let modelItemList = []
      // debug(model)
      debug(model.modelDir)
      modelItemList = await fg(path.join(config.contentRoot(), model.modelDir, '*', 'index.md'))

      for (let i = 0; i < modelItemList.length; i++) {
        let id = modelItemList[i].split('/').reverse()[1]
        let item = await model.read(id)
        // debug(`ITEM: ${model.modelDir}/${id}: `)
        // debug(item)



        let dataPathId = item.data.path ? item.data.path.split('/').reverse()[0].toString() : null
        let dataDiskId = id.toString()
        let dataFmId = item.data.id ? item.data.id.toString() : null

        // if (!dataDiskId) {debug('no disk ID for: ', id)}
        // if (!dataFmId) {debug('no frontmatter ID for: ', id)}
        // if (!dataPathId) {debug('no frontmatter path for: ', id)}

        // if ( model.modelDir != 'posts') {
        //   let delete1 = delete item.data.path
        //   // debug(`${model.modelDir}/${id} deleted frontmatter path?: ${delete1}`)
        //   let delete2 = delete item.data.id
        //   // debug(`${model.modelDir}/${id} deleted frontmatter id?: ${delete2}`)
        //   delete item.data.type

        // }
        // if ((item.data.id && item.data.path) && (item.data.id != item.data.path) && model.modelDir != 'posts') {
        //   // debug('-------------------------------------')
        //   // debug('DIRTY ITEM')
        //   // debug('-------------------------------------')
        //   // debug('item: ', item)
        //   // debug('id: ', id)
        // }

        if(item.data.id) {
          debug(`${model.modelDir}/${id}`)
        //   delete item.data.type
        }

        // debug(`ITEM: ${model.modelDir}/${id} (after property deletion): `)
        // debug(item)


        // // debug('Dir id: ', id)
        // // debug('Frontmatter id: ', item.data.id)
        // debug('Frontmatter path: ', item.data.path)
        // debug('item.data: ', item.data)
        // debug('item.content defined as: ', typeof(item.content))
        // debug('item.content length: ', item.content.length)
        // // debug('-------------------------------------')


        let saveContent = item.content ? item.content.toString() : null
        let saveId = id.toString()
        let saveData = item.data

        // debug('saveData: ', saveData)
        // debug('saveContent: ', saveContent)
        // debug('saveId: ', saveId)

        // await model.update(saveData, saveContent, saveId)

        // debug(`Updated ${model.modelDir}/${id} `)


      } // end for loop


      debug(`Length of ${model.modelDir} is ${modelItemList.length}`)


    } // end for of loop

    // debug(result)
  } catch (error) {
    debug('--------------------------------------')
    debug('ERROR ENCOUNTERED. OH NO!')
    debug('--------------------------------------')
    debug(error)
    debug('--------------------------------------')
    // throw error
  }
}());
