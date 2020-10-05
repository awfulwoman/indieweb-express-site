let rawData =
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

module.exports = {rawData, expectedNodeData}
