const monthsTable = {
  en: [
    {
      name: 'january',
      number: 1,
      abbr: 'jan',
      index: 0
    },
    {
      name: 'february',
      number: 2,
      abbr: 'feb',
      index: 1
    },
    {
      name: 'march',
      number: 3,
      abbr: 'mar',
      index: 2
    },
    {
      name: 'april',
      number: 4,
      abbr: 'apr',
      index: 3
    },
    {
      name: 'may',
      number: 5,
      abbr: 'may',
      index: 4
    },
    {
      name: 'june',
      number: 6,
      abbr: 'jun',
      index: 5
    },
    {
      name: 'july',
      number: 7,
      abbr: 'jul',
      index: 6
    },
    {
      name: 'august',
      number: 8,
      abbr: 'aug',
      index: 7
    },
    {
      name: 'september',
      number: 9,
      abbr: 'sep',
      index: 8
    },
    {
      name: 'october',
      number: 10,
      abbr: 'oct',
      index: 9
    },
    {
      name: 'november',
      number: 11,
      abbr: 'nov',
      index: 10
    },
    {
      name: 'december',
      number: 12,
      abbr: 'dec',
      index: 11
    }
  ]
}




// Accepts full name, abbreviated name, and month number
// months('dec') // { name: 'december', abbr: 'dec', number: 12, index: 11 }
// months('january') // { name: 'january', abbr: 'jan', number: 1, index: 0 }
// months(2) // { name: 'february', abbr: 'feb', number: 2, index: 1 }
// months(2, { language: 'de' }) // { name: 'Februar', abbr: 'feb', number: 2, index: 1 }


const months = (args, options = {}) => {
  if (!options.language) options.language = 'en'
  if (typeof options.language !== 'string') return false
  if (!args) return false
  if (typeof args !== 'number' && typeof args !== 'string') return false
  if (!monthsTable[options.language]) return false

  // loop through appropriate language object
  for (const month of monthsTable[options.language]) {
    if (typeof args === 'number' && parseInt(args) === month.number) return month
    if (typeof args === 'string' && (args.toLowerCase() === month.abbr || args.toLowerCase() === month.name)) return month
  }

  return false
}

module.exports = months
