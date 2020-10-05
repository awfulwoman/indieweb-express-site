const mock = require('mock-fs');
const db = require('./db');
let {rawData, expectedNodeData} = jest.mock('nodedata');
const path = require('path')
const config = require('../config')

describe('Check for empty parameters ', () => {
  test('create: Empty params', () => {
    return expect(db.create()).rejects.toThrow('db.create: Missing parameters');
  });
  test('read: Empty params', () => {
    return expect(db.read()).rejects.toThrow('db.read: Missing parameters');
  });
  test('Update: Empty params', () => {
    return expect(db.update()).rejects.toThrow('db.update: Missing parameters');
  });
  test('Delete: Empty params', () => {
    return expect(db.delete()).rejects.toThrow('db.delete: Missing parameters');
  });
});

describe('Check for correct type of parameters ', () => {
  test('create: non-string params', () => {
    return expect(db.create({}, {}, {})).rejects.toThrow('db.create: Parameters must be supplied as strings');
  });

  test('create: non-string params', () => {
    return expect(db.create(1, 1, 1)).rejects.toThrow('db.create: Parameters must be supplied as strings');
  });

  test('read: non-string params', () => {
    return expect(db.read({}, {}, {})).rejects.toThrow('db.read: Parameters must be supplied as strings');
  });

  test('read: non-string params', () => {
    return expect(db.read(1, 1, 1)).rejects.toThrow('db.read: Parameters must be supplied as strings');
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


  describe('Test ability to read data', () => {
    console.log(config.contentRoot)
    testRawFileDataPath = path.join(config.contentRoot, 'notes/0000/index.md');
    beforeEach(() => {
      mock({
          [config.dataRoot]: {},
          [testRawFileDataPath]: rawData
      });
    });


    test('reading from disk', () => {
      // console.log(testRawFileDataPath)
        // expect(db.read('0000')).toMatchObject(expectedNodeData);
        return db.read('notes','0000').then(data => {
          expect(data).toMatchObject(expectedNodeData);
        });
    });


    afterEach(() => mock.restore());
});

  
});
