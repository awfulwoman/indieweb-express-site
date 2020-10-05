const mock = require('mock-fs')
const note = require('./note.model');
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
    created: '2019-08-26T11:12:22+00:00',
    changed: '2019-09-24T19:20:44+00:00',
  }
}


describe('Read from a file', () => {
    
  let testRawFileDataPath = path.join(config.contentRoot, 'notes/0000/index.md');

  beforeEach(() => {
    mock({
      [testRawFileDataPath]: mock.load(path.resolve(config.appRoot, 'fixtures/mocked-note.md'), {lazy: false}),
    });
  });


  test('reading from disk', () => {
      return note.read('0000').then(data => {
        expect(data).toMatchObject(expectedNodeData);
      });
  });

  afterEach(() => mock.restore());

});
