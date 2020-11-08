const mock = require('mock-fs')
const note = require('../types/note.model');
const path = require('path')
const config = require('../../config')

let expectedNodeData = {
  content: 
`\nThis is a note. It is beautiful.`,
  data: {
    guid: 'e09e7eeb-da6d-4c83-9ff9-709d9ad4b300',
    type: 'note',
    id: '0000',
    title: 'This is a note',
    created: '2019-08-26T13:12:22.000+02:00',
    changed: '2019-09-24T21:20:44.000+02:00'
  }
}

describe('Checking parameters', () => {

  test('Create: Empty params', async () => {
    await expect(note.create()).rejects.toThrow('You must supply all params');
  });

  test('Read: Empty params', async () => {
    await expect(note.read()).rejects.toThrow('You must supply all params');
  });

  test('Update: Empty params', async () => {
    await expect(note.update()).rejects.toThrow('You must supply all params');
  });

  test('Delete: Empty params', async () => {
    await expect(note.del()).rejects.toThrow('You must supply all params');
  });
})

describe('Read from a file', () => {
    
  let testRawFileDataPath = path.join(config.contentRoot(), 'notes/0000/index.md');

  beforeEach(() => {
    mock({
      [testRawFileDataPath]: mock.load(path.resolve(config.appRoot(), 'fixtures/mocked-note.md'), {lazy: false}),
    });
  });

  test('Successfully reading from disk', async () => {
    await expect(note.read('0000')).resolves.toMatchObject(expectedNodeData);
  });

  test('Fail reading from disk', async () => {
    await expect(note.read('xyz')).rejects.toThrow();
  });

  afterEach(() => mock.restore());

});
