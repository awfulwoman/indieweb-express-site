const months = require('./months')

describe('Check parameter types ', () => {
  test('Fail on empty params', () => {
    expect(months()).toBe(false)
  })

  test('Fail on unsupported types', () => {
    expect(months({})).toBe(false)
    expect(months(true)).toBe(false)
    expect(months(undefined)).toBe(false)
    expect(months(null)).toBe(false)
    expect(months(9007199254740993n)).toBe(false)
  })
})

describe('Check parameter values', () => {
  test('Fail on numbers that are not months', () => {
    expect(months(0)).toBe(false)
    expect(months(13)).toBe(false)
  })

  test('Fail on strings that are not months', () => {
    expect(months('Januhumpty')).toBe(false)
    expect(months('nope')).toBe(false)
  })

  test('Pass on strings that are months', () => {
    expect(months('january')).toEqual({abbr: 'jan', name: 'january', number: 1, index: 0})
    expect(months('mar')).toEqual({abbr: 'mar', name: 'march', number: 3, index: 2})
  })

  test('Pass on strings that are months, no matter the case', () => {
    expect(months('jAnUARy')).toEqual({abbr: 'jan', name: 'january', number: 1, index: 0})
    expect(months('Mar')).toEqual({abbr: 'mar', name: 'march', number: 3, index: 2})
  })

  test('To pass with months that have same name and abbr', () => {
    expect(months('may')).toEqual({abbr: 'may', name: 'may', number: 5, index: 4})
    expect(months('May')).toEqual({abbr: 'may', name: 'may', number: 5, index: 4})
  })
})


describe('Check options', () => {
  test('Fail when languages are not strings', () => {
    expect(months('January', {language: 345})).toBe(false)
    expect(months('January', {language: {}})).toBe(false)
  })

  test('Fail on unsupported languages', () => {
    expect(months('January', {language: 'gr'})).toBe(false)
    expect(months('January', {language: 'be'})).toBe(false)
  })
})
