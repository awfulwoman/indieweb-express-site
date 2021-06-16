const Nodecache = require('node-cache')

const cache = require('../cache')

let expectedNodeData = {
  content:
    `\nThis is a note. It is beautiful.\n`,
  data: {
    guid: 'e09e7eeb-da6d-4c83-9ff9-709d9ad4b300',
    type: 'note',
    id: '0000',
    title: 'This is a note',
    created: '2019-08-26T11:12:22.000Z',
    modified: '2019-09-24T19:20:44.000Z',
  }
}

describe('Checking model cache', () => {
  const testCache1 = new Nodecache()
  let testCache1Result = [
    expectedNodeData,
    expectedNodeData,
    expectedNodeData,
    expectedNodeData,
    expectedNodeData,
    expectedNodeData,
    expectedNodeData,
    expectedNodeData,
    expectedNodeData,
    expectedNodeData,
  ]

  let testCache2Result = [
    expectedNodeData,
    expectedNodeData,
    expectedNodeData,
    expectedNodeData,
    expectedNodeData,
    expectedNodeData,
    expectedNodeData,
    expectedNodeData,
    expectedNodeData,
    expectedNodeData,
    // '20210705t1200': expectedNodeData,
    // '20200605t1201': expectedNodeData,
    // '20200605t1200': expectedNodeData,
    // '3657': expectedNodeData,
    // '2034': expectedNodeData,
    // '1450': expectedNodeData,
    // '1123': expectedNodeData,
    // '10': expectedNodeData,
    // '7': expectedNodeData,
    // '1': expectedNodeData
  ]
  const testCache2 = new Nodecache()
  beforeEach(() => {
    testCache1.mset([
      { key: '0', val: expectedNodeData },
      { key: '1', val: expectedNodeData },
      { key: '2', val: expectedNodeData },
      { key: '3', val: expectedNodeData },
      { key: '4', val: expectedNodeData },
      { key: '5', val: expectedNodeData },
      { key: '6', val: expectedNodeData },
      { key: '7', val: expectedNodeData },
      { key: '8', val: expectedNodeData },
      { key: '9', val: expectedNodeData }
    ])

    testCache2.mset([
      { key: '20210705t1200', val: expectedNodeData },
      { key: '1', val: expectedNodeData },
      { key: '7', val: expectedNodeData },
      { key: '10', val: expectedNodeData },
      { key: '1123', val: expectedNodeData },
      { key: '1450', val: expectedNodeData },
      { key: '2034', val: expectedNodeData },
      { key: '3657', val: expectedNodeData },
      { key: '20200605t1200', val: expectedNodeData },
      { key: '20200605t1201', val: expectedNodeData }
    ])
  })

  test('Test cache lists 10 entries in descending order', async () => {
    await expect(cache.list(testCache1, 'testType')).resolves.toMatchObject(testCache1Result)
  });

  test('Test cache lists 10 complex entries in descending order', async () => {
    await expect(cache.list(testCache2, 'testType')).resolves.toMatchObject(testCache2Result)
  });

})
