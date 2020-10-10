const Nodecache = require('node-cache')

const list = require('../list')

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

describe('Checking model cache', () => {
  const testCache1 = new Nodecache()
  const testCache2 = new Nodecache()
  beforeEach(() => {
    testCache1.mset([
      {key:'0000', val: expectedNodeData},
      {key:'0001', val: expectedNodeData},
      {key:'0002', val: expectedNodeData},
      {key:'0003', val: expectedNodeData},
      {key:'0004', val: expectedNodeData},
      {key:'0005', val: expectedNodeData},
      {key:'0006', val: expectedNodeData},
      {key:'0007', val: expectedNodeData},
      {key:'0008', val: expectedNodeData},
      {key:'0009', val: expectedNodeData}
    ])

    testCache2.mset([
      {key:'20210705t1200', val: expectedNodeData},
      {key:'1', val: expectedNodeData},
      {key:'7', val: expectedNodeData},
      {key:'10', val: expectedNodeData},
      {key:'1123', val: expectedNodeData},
      {key:'1450', val: expectedNodeData},
      {key:'2034', val: expectedNodeData},
      {key:'3657', val: expectedNodeData},
      {key:'20200605t1200', val: expectedNodeData},
      {key:'20200605t1201', val: expectedNodeData}
    ])
  })

  test('Test cache lists 10 entries', async () => {
    await expect(list(testCache1)).resolves.toMatchObject([ '0000', '0001', '0002', '0003', '0004', '0005', '0006', '0007', '0008', '0009' ])
  });

  test('Test cache lists 10 entries', async () => {
    await expect(list(testCache2)).resolves.toMatchObject([ '1', '7', '10', '1123', '1450', '2034', '3657', '20200605t1200', '20200605t1201', '20210705t1200' ])
  });
  
})
