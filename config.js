const path = require('path');
const appRoot = require('app-root-path');
const { DateTime } = require('luxon');
const uuid = require('uuid');
const validator = require('validator');
const geo = require('./utilities/form-geo');
const tags = require('./utilities/form-tags');

const config = {
  appRoot: appRoot.path,
  dataRoot: path.join(appRoot.path, 'data'),
  contentRoot: path.join(appRoot.path, 'data', 'content'),
  sitePort: process.env.SITEPORT || '3000',
  sitePortExternal: process.env.SITEPORTEXTERNAL || '80',
  siteProtocol: `${process.env['SITEPROTOCOL'] || 'http'}://`,
  siteDomain: process.env['SITEDOMAIN'] || '127.0.0.1',
  fileDateFormat: "yyyyLLdd't'HHmm",
  globalFields: [
    {
      fieldId: 'guid',
      fieldTitle: 'A GUID',
      formFieldRenderType: 'text',
      fieldDefaultValueGenerator: uuid.v4()
    },
    {
      fieldId: 'slug',
      fieldTitle: `A unique short text string, used to build a node's URL`,
      formFieldRenderType: 'text',
      fieldDefaultValueGenerator: DateTime.local().toFormat("yyyyLLdd't'HHmm")
    },
    {
      fieldId: 'created',
      fieldTitle: 'Created',
      formFieldRenderType: 'text',
      fieldDefaultValueGenerator: DateTime.local().toString(),
    },
    {
      fieldId: 'updated',
      fieldTitle: 'Last updated',
      formFieldRenderType: 'text',
      fieldDefaultValueGenerator: DateTime.local().toString()
    }
  ],
  nodeTypes: [
    {
      id: 'notes',
      machineSingular: 'note',
      machinePlural: 'notes',
      englishSingular: 'note',
      englishPlural: 'notes',
      generateRssFeed: true,  // generate /notes/feed
      includeInMainRssFeed: true, // include in /feed? can be overriden per node
      defaultVisibility: {
        nodeRss: true, // List in nodeType RSS feed.
        nodeIndex: true, // List in nodeType index.
        nodePublic: true // Make visible at URL.
      },
      fields: [
        {
          fieldId: 'title',
          fieldTitle: 'Give this note a title',
          formFieldRenderType: 'text',
        },
        {
          fieldId: 'content',
          fieldTitle: 'Write your note content here',
          formFieldRenderType: 'textarea',
        },
        {
          fieldId: 'tags',
          fieldTitle: 'Why not add a few tags?',
          formFieldRenderType: 'multitext', // comma-seperated list
          postProcess: [
            tags
          ]
        },
        {
          fieldId: 'images',
          fieldTitle: 'Add some images to liven it up',
          formFieldRenderType: 'group',
          children: [
            {
              fieldId: 'image1',
              fieldTitle: 'Image 1',
              formFieldRenderType: 'fileupload'
            },
            {
              fieldId: 'image2',
              fieldTitle: 'Image 2',
              formFieldRenderType: 'fileupload'
            },
            {
              fieldId: 'image3',
              fieldTitle: 'Image 3',
              formFieldRenderType: 'fileupload'
            },
            {
              fieldId: 'image4',
              fieldTitle: 'Image 4',
              formFieldRenderType: 'fileupload'
            }
          ]
        },
        {
          fieldId: 'place_geo',
          fieldTitle: 'GPS Co-ordinates',
          formFieldRenderType: 'geo',
          postProcess: [
            geo
          ]
        },
        {
          fieldId: 'place_name',
          fieldTitle: 'Where was this note made?',
          formFieldRenderType: 'text'
        },
        {
          fieldId: 'meta',
          fieldTitle: 'Metadata',
          formFieldRenderType: 'group',
          get children() {
            return config.globalFields
          }
        },
        {
          fieldId: 'visibility',
          fieldTitle: 'Node visibility',
          formFieldRenderType: 'group',
          get children() {
            return config._getDefaults('notes')
          }
        }
      ],
    },
    {
      id: 'bookmarks',
      machineSingular: 'bookmark',
      machinePlural: 'bookmarks',
      englishSingular: 'bookmark',
      englishPlural: 'bookmarks',

    },
    {
      id: 'replies',
      machineSingular: 'reply',
      machinePlural: 'replies',
      englishSingular: 'reply',
      englishPlural: 'replies',

    },
    {
      id: 'checkins',
      machineSingular: 'checkin',
      machinePlural: 'checkins',
      englishSingular: 'check-in',
      englishPlural: 'check-ins',

    },
    {
      id: 'quotes',
      machineSingular: 'quote',
      machinePlural: 'quotes',
      englishSingular: 'quote',
      englishPlural: 'quotes',

    },
    {
      id: 'likes',
      machineSingular: 'like',
      machinePlural: 'likes',
      englishSingular: 'like',
      englishPlural: 'likes',

    },
    {
      id: 'posts',
      machineSingular: 'post',
      machinePlural: 'posts',
      englishSingular: 'post',
      englishPlural: 'posts',

    },
    {
      id: 'reposts',
      machineSingular: 'repost',
      machinePlural: 'reposts',
      englishSingular: 'repost',
      englishPlural: 'reposts',

    }
  ],
  _getDefaults: function (type) {
    // All of this just to pick up the defaults
    let defaults = config.nodeTypes.filter(nodeType => nodeType.id === type)
    defaults = defaults[0].defaultVisibility

    childrenExport = []
    for (const key in defaults) {
      if (defaults.hasOwnProperty(key)) {
        const element = defaults[key];
        let obj = {};
        switch (key) {
          case 'nodeRss':
            obj.fieldId = key
            obj.fieldTitle = 'Show in notes RSS feed';
            obj.fieldDefaultValueGenerator = defaults[key];
            obj.formFieldRenderType = 'boolean';
            break;

          case 'nodeIndex':
            obj.fieldId = key
            obj.fieldTitle = 'Show in notes page feed'
            obj.fieldDefaultValueGenerator = defaults[key];
            obj.formFieldRenderType = 'boolean';
            break;

          case 'nodePublic':
            obj.fieldId = key
            obj.fieldTitle = 'Should this be public?'
            obj.fieldDefaultValueGenerator = defaults[key];
            obj.formFieldRenderType = 'boolean';
            break;

          default:
            break;
        }
        childrenExport.push(obj)
      }
    }
    return childrenExport;
  },
}

module.exports = config
