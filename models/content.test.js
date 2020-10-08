const mock = require('mock-fs');
const fs = require('fs');
const path = require('path');
const config = require('../config');
const content = require('./content');

let rawNodeData = 
`---
guid: e09e7eeb-da6d-4c83-9ff9-709d9ad4b300
type: post
id: 3145
title: 'React'
path: /posts/react
created: '2019-08-26T11:12:22+00:00'
changed: '2019-09-24T19:20:44+00:00'
strapline: 'Why I have a problem with React the library and spend a lot of time talking to my therapist'
show_in_index: true
show_in_rss: true
coverimage: 'bloop.png'
sections:
  - piggo
  - dog
  - cat
  - birb
---

So, [#ReactGate](https://twitter.com/hashtag/Reactgate?src=hash) has become a thing. What's been fomenting for a while blew up last week, with two prominent White Men In Tech having little tantrum Twitter breaks, and a wonderful woman of colour working as a dev/designer feeling she is no longer welcome in our industry and planning to leave as soon as it's financially possible.

![This is a photo](photo.jpg)

This is some more text.
`

let expectedNodeData = {
    content: 
`\nSo, [#ReactGate](https://twitter.com/hashtag/Reactgate?src=hash) has become a thing. What's been fomenting for a while blew up last week, with two prominent White Men In Tech having little tantrum Twitter breaks, and a wonderful woman of colour working as a dev/designer feeling she is no longer welcome in our industry and planning to leave as soon as it's financially possible.

![This is a photo](photo.jpg)

This is some more text.
`,
    meta: {
      guid: 'e09e7eeb-da6d-4c83-9ff9-709d9ad4b300',
      type: 'post',
      id: 3145,
      title: 'React',
      strapline: 'Why I have a problem with React the library and spend a lot of time talking to my therapist',
      path: '/posts/react',
      created: '2019-08-26T11:12:22+00:00',
      changed: '2019-09-24T19:20:44+00:00',
      show_in_index: true,
      show_in_rss: true,
      keyPath: '/posts/3145/index.md',
      coverimage: 'bloop.png',
      sections: [
        'piggo',
        'dog',
        'cat',
        'birb'
        ]
    }
}

describe('Generate cache key from path', () => {
    test('Path results in key', () => {
    expect(content.getKeyFromPath('/posts/3145/')).toBe('/posts/3145/index.md')  
    });

    test('Path results in key (no leading slash)', () => {
        expect(content.getKeyFromPath('posts/3145/')).toBe('/posts/3145/index.md')  
    });

    test('Path results in key (no trailing slash)', () => {
        expect(content.getKeyFromPath('/posts/3145')).toBe('/posts/3145/index.md')  
    });

    test('Path results in key (no slashes)', () => {
        expect(content.getKeyFromPath('posts/3145')).toBe('/posts/3145/index.md')  
    });

    test('Path results in key (with index.md)', () => {
        expect(content.getKeyFromPath('/posts/3145/index.md')).toBe('/posts/3145/index.md')  
    });

    test('Path results in key (non-standard markdown file)', () => {
        expect(content.getKeyFromPath('/posts/3145/test.md')).toBe('/posts/3145/test.md')  
    });
});


describe('Test ability to load node data', () => {
    beforeEach(() => {
        testRawFileDataPath = path.join(config.contentRoot, `posts/3145/index.md`);
        mock({
            [config.contentRoot]: {},
            [testRawFileDataPath]: rawNodeData
        });
    });

    test('Loading from disk a non-existant path returns null', () => {
        expect(content.loadNodeSync('/does/not/exist/')).toBe(false)
    });

    test('Loading from disk a path that exists to return data', () => {
        expect(content.loadNodeSync('/posts/3145/')).toMatchObject(expectedNodeData);
    });

    test('Loading from disk a path that exists to return data (no trailing slash)', () => {
        expect(content.loadNodeSync('/posts/3145')).toMatchObject(expectedNodeData)
    });

    test('Loading from disk a path that exists to return data (no forward or trailing slash)', () => {
        expect(content.loadNodeSync('posts/3145')).toMatchObject(expectedNodeData)
    });

    test('Loading from cache a non-existant path returns null', () => {
        expect(content.loadNodeFromCache('/does/not/exist/')).toBe(false)
    });

    test('Loading from cache a path that exists to return data', () => {
        // We expect the cache to be prepped due to previous tests
        expect(content.loadNodeFromCache('/posts/3145/')).toMatchObject(expectedNodeData);
    });

    test('Loading from cache a path that exists to return data (no trailing slash)', () => {
        expect(content.loadNodeFromCache('/posts/3145')).toMatchObject(expectedNodeData)
    });

    test('Loading from cache a path that exists to return data (no forward or trailing slash)', () => {
        expect(content.loadNodeFromCache('posts/3145')).toMatchObject(expectedNodeData)
    });

    afterEach(() => mock.restore());
});

// describe('Test ability to load a non-node file from disk', () => {
//     const testImageFile = mock.bypass(() => fs.readFileSync('./test.jpg', 'utf-8'));
//     beforeEach(() => {
//         testRawFileDataPath = path.join(config.contentRoot, '/posts/3145/files/photo.jpg');
//         mock({
//             [config.contentRoot]: {},
//             [testRawFileDataPath]: testImageFile
//         })
//     });

//     test('Loading a non-existant path returns null', () => {
//         expect(content.loadNodeFileSync('/posts/3145/files/nothing.jpg')).toBe(false)
//     });
// });

