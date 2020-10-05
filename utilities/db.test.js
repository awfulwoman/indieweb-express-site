const mock = require('mock-fs');
const db = require('./db');
let {rawData, expectedNodeData} = jest.mock('nodedata');
const path = require('path')
const config = require('../config')

describe('Check for empty parameters ', () => {
  test('Save: Empty params', () => {
    return expect(db.save()).rejects.toThrow('db.save: Missing parameters');
  });
  test('Load: Empty params', () => {
    return expect(db.load()).rejects.toThrow('db.load: Missing parameters');
  });
  test('Update: Empty params', () => {
    return expect(db.update()).rejects.toThrow('db.update: Missing parameters');
  });
  test('Delete: Empty params', () => {
    return expect(db.delete()).rejects.toThrow('db.delete: Missing parameters');
  });
});

describe('Check for correct type of parameters ', () => {
  test('Save: non-string params', () => {
    return expect(db.save({}, {}, {})).rejects.toThrow('db.save: Parameters must be supplied as strings');
  });

  test('Save: non-string params', () => {
    return expect(db.save(1, 1, 1)).rejects.toThrow('db.save: Parameters must be supplied as strings');
  });

  test('Load: non-string params', () => {
    return expect(db.load({}, {}, {})).rejects.toThrow('db.load: Parameters must be supplied as strings');
  });

  test('load: non-string params', () => {
    return expect(db.load(1, 1, 1)).rejects.toThrow('db.load: Parameters must be supplied as strings');
  });

  test('Update: non-string params', () => {
    return expect(db.update({}, {}, {})).rejects.toThrow('db.update: Parameters must be supplied as strings');
  });

  test('Update: non-string params', () => {
    return expect(db.update(1, 1, 1)).rejects.toThrow('db.update: Parameters must be supplied as strings');
  });

  test('Delete: non-string params', () => {
    return expect(db.delete({}, {}, {})).rejects.toThrow('db.delete: Parameters must be supplied as strings');
  });

  test('Delete: non-string params', () => {
    return expect(db.delete(1, 1, 1)).rejects.toThrow('db.delete: Parameters must be supplied as strings');
  });

});

describe('Check for working file operations', () => {


  describe('Test ability to load data', () => {
    console.log(config.contentRoot)
    testRawFileDataPath = path.join(config.contentRoot, 'notes/0000/index.md');
    beforeEach(() => {
      mock({
          [config.dataRoot]: {},
          [testRawFileDataPath]: rawData
      });
    });


    test('Loading from disk', () => {
      // console.log(testRawFileDataPath)
        // expect(db.load('0000')).toMatchObject(expectedNodeData);
        return db.load('notes','0000').then(data => {
          expect(data).toMatchObject(expectedNodeData);
        });
    });


    afterEach(() => mock.restore());
});

  
});
