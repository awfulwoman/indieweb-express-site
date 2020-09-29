const { check, checkSchema, validationResult } = require('express-validator');
const tagsToArray = require('../utilities/form-tags');

let obj = {
  type: {
    in: ['body'],
    isEmpty: {
      negated: true,
      errorMessage: 'You gotta tell me what you want to save',
    },
  },
  title: {
    // The location of the field, can be one or more of body, cookies, headers, params or query.
    // If omitted, all request locations will be checked
    in: ['body'],
    isEmpty: {
      negated: true,
      errorMessage: 'Title is not filled!',
    },
    trim: true
  },
  content: {
    in: ['body'],
    optional: {
      options: {
        nullable: true,
        checkFalsy: true,
      }
    },
    trim: true
  },
  tags: {
    optional: {
      options: {
        nullable: true,
        checkFalsy: true,
      }
    },
    customSanitizer: {
      options: (value) => {
        return tagsToArray(value);
      }
    }
  },
  image1: {
    in: ['body'],
    optional: {
      options: {
        nullable: true,
        checkFalsy: true,
      }
    },
    trim: true
  },
  image2: {
    in: ['body'],
    optional: {
      options: {
        nullable: true,
        checkFalsy: true,
      }
    },
    trim: true
  },
  image3: {
    in: ['body'],
    optional: {
      options: {
        nullable: true,
        checkFalsy: true,
      }
    },
    trim: true
  },
  image4: {
    in: ['body'],
    optional: {
      options: {
        nullable: true,
        checkFalsy: true,
      }
    },
    trim: true
  },
  place_geo: {
    in: ['body'],
    optional: {
      options: {
        nullable: true,
        checkFalsy: true,
      }
    },
    isLatLong: {
      errorMessage: 'Please supply a valid set of GPS values',
    },
    customSanitizer: {
      options: (value) => {
        return tagsToArray(value);
      }
    },
  },
  place_name: {
    in: ['body'],
    optional: {
      options: {
        nullable: true,
        checkFalsy: true,
      }
    },
    trim: true
  },
  nodeRss: {
    in: ['body'],
    isBoolean: true,
    toBoolean: true,
    errorMessage: 'You must set the nodeRSS field'
  },
  nodeIndex: {
    in: ['body'],
    isBoolean: true,
    toBoolean: true,
    errorMessage: 'You must set the nodeIndex field'
  },
  nodePublic: {
    in: ['body'],
    isBoolean: true,
    toBoolean: true,
    errorMessage: 'You must set the nodePublic field'
  }
}
const validateNotes = [
  checkSchema({...obj}), (req, res, next) => { 
    // console.log(req.params.nodeType)
    next();
  }
];

module.exports = validateNotes;
