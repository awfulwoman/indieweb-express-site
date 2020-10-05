const mock = require('mock-fs')
const db = require('./db');
const path = require('path')
const config = require('../config')

let expectedNodeData = {
  content: 
`\nThis is a note. It is beautiful.`,
  data: {
    guid: 'e09e7eeb-da6d-4c83-9ff9-709d9ad4b300',
    type: 'note',
    id: '0000',
    title: 'This is a note',
    created: '2019-08-26T11:12:22+00:00',
    changed: '2019-09-24T19:20:44+00:00',
  }
}

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
    
    let testRawFileDataPath = path.join(config.contentRoot, 'notes/0000/index.md');

    beforeEach(() => {
      mock({
        [testRawFileDataPath]: mock.load(path.resolve(__dirname, '__mocks__/mocked-note.md'), {lazy: false}),
      });
    });


    test('reading from disk', () => {
        return db.read('notes','0000').then(data => {
          expect(data).toMatchObject(expectedNodeData);
        });
    });

    afterEach(() => mock.restore());
});

  
});
