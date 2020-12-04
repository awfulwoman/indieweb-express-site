const resolveEndpoint = require('./resolve-endpoint')

describe('Check negatives', () => {
  test('Empty params', async () => {
    await expect(resolveEndpoint()).rejects.toThrow('Required parameter not supplied: destination')
  })

  test('Not a URL', async () => {
    await expect(resolveEndpoint('notWhatIShouldBe')).rejects.toThrow('Parameter must be a URL: destination')
  })
})

describe('Webmention.rocks conformance tests', () => {

  // Discovery Test #1
  // This post advertises its Webmention endpoint with an HTTP Link header. 
  // The URL is relative, so this will also test whether your discovery code properly resolves the relative URL.
  // https://webmention.rocks/test/1
  // test('Empty params', async () => {
    // await expect(resolveEndpoint('https://webmention.rocks/test/1')).rejects.toThrow('Required parameter not supplied: destination')
  // })

  // Discovery Test #2
  // This post advertises its Webmention endpoint with an HTTP Link header. The Webmention endpoint is listed as an absolute URL.
  // https://webmention.rocks/test/2

  // Discovery Test #3
  // This post advertises its Webmention endpoint with an HTML <link> tag in the document. The URL is relative, so this will also test whether your discovery code properly resolves the relative URL.
  // https://webmention.rocks/test/3

  // Discovery Test #4
  // This post advertises its Webmention endpoint with an HTML <link> tag in the document. The Webmention endpoint is listed as an absolute URL.
  // https://webmention.rocks/test/4

  // Discovery Test #5
  // This post advertises its Webmention endpoint with an HTML <a> tag in the body. The URL is relative, so this will also test whether your discovery code properly resolves the relative URL.
  // https://webmention.rocks/test/5

  // Discovery Test #6
  // This post advertises its Webmention endpoint with an HTML <a> tag in the body. The Webmention endpoint is listed as an absolute URL.
  // https://webmention.rocks/test/6

  // Discovery Test #7
  // This post advertises its Webmention endpoint with an HTTP header with intentionally unusual casing, "LinK". This helps you test whether you are handling HTTP header names in a case insensitive way.
  // https://webmention.rocks/test/7

  // Discovery Test #8
  // This post advertises its Webmention endpoint with an HTTP Link header. Unlike tests #1 and #2, the rel value is quoted, since HTTP allows both rel="webmention" and rel=webmention for the Link header.
  // https://webmention.rocks/test/8

  // Discovery Test #9
  // This post has a <link> tag with multiple rel values.
  // https://webmention.rocks/test/9

  // Discovery Test #10
  // This post has an HTTP Link header with multiple rel values.
  // https://webmention.rocks/test/10

  // Discovery Test #11
  // This post advertises its Webmention endpoint in the HTTP Link header, HTML <link> tag, as well as an <a> tag. Your Webmention client must only send a Webmention to the one in the Link header.
  // https://webmention.rocks/test/11

  // Discovery Test #12
  // This post contains a link tag with a rel value of "not-webmention", just to make sure you aren't using naïve string matching to find the endpoint. There is also a correct endpoint defined, so if your comment appears below, it means you successfully ignored the false endpoint.
  // https://webmention.rocks/test/12

  // Discovery Test #13
  // This post contains an HTML comment that contains a rel=webmention element, which should not receive a Webmention since it's inside an HTML comment. There is also a correct endpoint defined, so if your comment appears below, it means you successfully ignored the false endpoint.
  // https://webmention.rocks/test/13

  // Discovery Test #14
  // This post contains sample code with escaped HTML which should not be discovered by the Webmention client. <a href="/test/14/webmention/error" rel="webmention"></a> There is also a correct endpoint defined, so if your comment appears below, it means you successfully ignored the false endpoint.
  // https://webmention.rocks/test/14

  // Discovery Test #15
  // This post has a <link> tag where the href value is an empty string, meaning the page is its own Webmention endpoint. This tests the relative URL resolver of the sender to ensure an empty string is resolved to the page's URL.
  // https://webmention.rocks/test/15

  // Discovery Test #16
  // This post advertises its Webmention endpoint in an HTML <a> tag, followed by a later definition in a <link> tag. Your Webmention client must only send a Webmention to the one in the <a> tag since it appears first in the document.
  // https://webmention.rocks/test/16

  // Discovery Test #17
  // This post advertises its Webmention endpoint in an HTML <link> tag followed by a later definition in an <a> tag. Your Webmention client must only send a Webmention to the one in the <link> tag since it appears first in the document.
  // https://webmention.rocks/test/17

  // Discovery Test #18
  // This post returns two HTTP Link headers, the first with a different rel value. This ensures your code correcly parses the HTTP response when multiple Link headers are returned.
  // https://webmention.rocks/test/18

  // Discovery Test #19
  // This post returns one HTTP Link header with multiple values separated by a comma. This ensures your code correcly parses the HTTP headers.
  // https://webmention.rocks/test/19

  //   Discovery Test #20
  // This post has a <link> tag which has no href attribute. Your Webmention client should not find this link tag, and should send the webmention to this endpoint instead.
  // https://webmention.rocks/test/20

  // Discovery Test #21
  // This post's Webmention endpoint has query string parameters. Your Webmention client must preserve the query string parameters, and not send them in the post body.
  // https://webmention.rocks/test/21

  // Discovery Test #22
  // This post's Webmention endpoint is relative to the page rather than relative to the host.
  // https://webmention.rocks/test/22

  // Discovery Test #23
  // To pass this test, send a Webmention to the URL below. That URL is a redirect to the actual Webmention page which advertises the Webmention endpoint. This will test that your endpoint follows redirects on the target and resolves the relative URL relative to the resulting URL rather than the original URL.
  // https://webmention.rocks/test/23/page


})

