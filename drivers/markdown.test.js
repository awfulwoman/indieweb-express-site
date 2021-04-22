const mock = require('mock-fs')
const markdown = require('./markdown');
const path = require('path')
const config = require('../config')
const outdent = require('outdent')

let expectedNodeData = {
  content: {
    markdown: 'This is a note. It is beautiful.'
  },
  data: {
    guid: 'e09e7eeb-da6d-4c83-9ff9-709d9ad4b300',
    type: 'note',
    id: '0000',
    title: 'This is a note',
    created: '2019-08-26T11:12:22.000Z',
    modified: '2019-09-24T19:20:44.000Z',
  }
}

describe('Check for empty parameters ', () => {
  test('create: Empty params', async () => {
    await expect(markdown.create()).rejects.toThrow('markdown.create: Missing parameters');
  });
  test('read: Empty params', async () => {
    await expect(markdown.read()).rejects.toThrow('markdown.read: Missing parameters');
  });
  test('Update: Empty params', async () => {
    await expect(markdown.update()).rejects.toThrow('markdown.update: Missing parameters');
  });
  test('Delete: Empty params', async () => {
    await expect(markdown.del()).rejects.toThrow('markdown.del: Missing parameters');
  });
});

describe('Check for correct type of parameters ', () => {
  test('create: non-string params', async () => {
    await expect(markdown.create({}, {}, {})).rejects.toThrow('markdown.create: Parameters must be supplied as strings');
  });

  test('create: non-string params', async () => {
    await expect(markdown.create(1, 1, 1)).rejects.toThrow('markdown.create: Parameters must be supplied as strings');
  });

  test('read: non-string params', async () => {
    await expect(markdown.read({}, {}, {})).rejects.toThrow('markdown.read: Parameters must be supplied as strings');
  });

  test('read: non-string params', async () => {
    await expect(markdown.read(1, 1, 1)).rejects.toThrow('markdown.read: Parameters must be supplied as strings');
  });

  test('Update: non-string params', async () => {
    await expect(markdown.update({}, {}, {})).rejects.toThrow('markdown.update: Parameters must be supplied as strings');
  });

  test('Update: non-string params', async () => {
    await expect(markdown.update(1, 1, 1)).rejects.toThrow('markdown.update: Parameters must be supplied as strings');
  });

  test('Delete: non-string params', async () => {
    await expect(markdown.del({}, {}, {})).rejects.toThrow('markdown.del: Parameters must be supplied as strings');
  });

  test('Delete: non-string params', async () => {
    await expect(markdown.del(1, 1, 1)).rejects.toThrow('markdown.del: Parameters must be supplied as strings');
  });

});

describe('Check for working file operations', () => {


  describe('Test ability to read data', () => {

    let testRawFileDataPath = path.join(config.contentRoot(), 'notes/0000/index.md');
    let expectedData = outdent`---
    guid: e09e7eeb-da6d-4c83-9ff9-709d9ad4b300
    type: note
    id: '0000'
    title: 'This is a note'
    created: '2019-08-26T11:12:22.000Z'
    modified: '2019-09-24T19:20:44.000Z'
    ---
    
    This is a note. It is beautiful.

    `

    beforeEach(() => {
      mock({
        [testRawFileDataPath]: mock.load(path.resolve(config.appRoot(), 'fixtures/mocked-note.md'), { lazy: false }),
      });
    });


    test('reading from disk', async () => {
      await expect(markdown.read('notes', '0000')).resolves.toEqual(expectedData);
    });

    afterEach(() => mock.restore());
  });
});
