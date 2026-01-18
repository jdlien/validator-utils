/**
 * Utilities used by the Validator class.
 *
 * @format
 */

type DateParts = { year: number; month: number; day: number }

// Pre-compiled regex patterns (hoisted to module scope for performance)
const TIME_RE = /\d{1,2}:\d\d(?::\d\d?)?\s?(?:[ap]m?)?/gi
const DAY_OF_WEEK_RE = /(^|\b)(mo|tu|we|th|fr|sa|su|lu|mard|mer|jeu|ve|dom)[\w]*\.?/gi
const SHORT_TIME_RE = /^(\d{1,2})(?::(\d{1,2}))?\s*(?:(a|p)\.?m?\.?)?$/i
const TIME_FULL_RE = /^(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?\s*(?:(a|p)m?)?$/i
const URL_PARSE_RE = /^(?:[a-z+]+:)?\/\//i
const URL_VALIDATE_RE = /^(?:[-a-z+]+:)?\/\//i
const ZIP_RE = /^\d{5}(-\d{4})?$/
const POSTAL_CA_RE = /^[ABCEGHJKLMNPRSTVXY][0-9][ABCEGHJKLMNPRSTVWXYZ] ?[0-9][ABCEGHJKLMNPRSTVWXYZ][0-9]$/

// Pre-compiled email validation regex (RFC 5322 compliant)
const EMAIL_TLD_RE = /^.+@.+\.[a-zA-Z0-9]{2,}$/
const EMAIL_FULL_RE = new RegExp(
  "^([a-zA-Z0-9!#$%'*+/=?^_`{|}~-]+" +
    "(?:\\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*" +
    '|"(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21\\x23-\\x5b\\x5d-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])*")' +
    '@((?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)$'
)

export function isFormControl(el: any): boolean {
  return (
    el instanceof HTMLInputElement ||
    el instanceof HTMLSelectElement ||
    el instanceof HTMLTextAreaElement
  )
}

interface ValidationResult {
  valid: boolean
  error?: boolean
  messages: string[]
}

// Checks if an element has a type or data-type attribute matching
// one of the types in the passed array
export function isType(
  el: HTMLInputElement | HTMLTextAreaElement,
  types: string | string[]
): boolean {
  if (typeof types === 'string') types = [types]

  const dataType = el.dataset.type || ''
  const type = el.type

  if (types.includes(dataType)) return true
  if (types.includes(type)) return true
  return false
}

// Converts moment.js-style formats strings to the flatpickr format
// https://flatpickr.js.org/formatting/
// Useful to use FlatPickr in conjunction with Validator
// Not comprehensive but covers common format strings
export function momentToFPFormat(format: string) {
  return format
    .replace(/YYYY/g, 'Y')
    .replace(/YY/g, 'y')
    .replace(/MMMM/g, 'F')
    .replace(/MMM/g, '{3}')
    .replace(/MM/g, '{2}')
    .replace(/M/g, 'n')
    .replace(/DD/g, '{5}')
    .replace(/D/g, 'j')
    .replace(/dddd/g, 'l')
    .replace(/ddd/g, 'D')
    .replace(/dd/g, 'D')
    .replace(/d/g, 'w')
    .replace(/HH/g, '{6}')
    .replace(/H/g, 'G')
    .replace(/hh/g, 'h')
    .replace(/mm/g, 'i')
    .replace(/m/g, 'i')
    .replace(/ss/g, 'S')
    .replace(/s/g, 's')
    .replace(/A/gi, 'K')
    .replace(/\{3\}/g, 'M')
    .replace(/\{2\}/g, 'm')
    .replace(/\{5\}/g, 'd')
    .replace(/\{6\}/g, 'H')
}

// Converts month name to zero-based month number
export function monthToNumber(str: string | number): number {
  const num = parseInt(str as string)
  if (typeof str === 'number' || !isNaN(num)) return num - 1

  const m = new Date(`1 ${str} 2000`).getMonth()
  if (!isNaN(m)) return m

  const dict: { [key: string]: number } = {
    ja: 0,
    en: 0,
    fe: 1,
    fé: 1,
    ap: 3,
    ab: 3,
    av: 3,
    mai: 4,
    juin: 5,
    juil: 6,
    au: 7,
    ag: 7,
    ao: 7,
    se: 8,
    o: 9,
    n: 10,
    d: 11,
  }

  for (const key in dict) {
    if (str.toLowerCase().startsWith(key)) return dict[key]
  }

  throw new Error('Invalid month name: ' + str)
}

// Convert two-digit year to a four digit year
export function yearToFull(year: number | string): number {
  if (typeof year === 'string') year = parseInt(year.replace(/\D/g, ''))
  if (year > 99) return year
  // If year less than 20 years in the future, assume the 21st century
  if (year < (new Date().getFullYear() + 20) % 100) return year + 2000
  return year + 1900
}

// Parses a string and returns the most plausible date
export function parseDate(value: string | Date): Date {
  if (value instanceof Date) return value

  value = value.trim().toLowerCase()

  let year: number = 0
  let month: number = 0
  let day: number = 0
  let hour: number = 0
  let minute: number = 0
  let second: number = 0

  // Reset lastIndex since we reuse the global regex
  TIME_RE.lastIndex = 0
  // If the value contains a time, set the time variables
  if (TIME_RE.test(value)) {
    TIME_RE.lastIndex = 0
    const timeStr = value.match(TIME_RE)![0]
    // Remove the time from the string
    value = value.replace(timeStr, '').trim()
    const timeParts = parseTime(timeStr)
    // Assign the time to the variables
    if (timeParts !== null) ({ hour, minute, second } = timeParts)

    // If the value seems to be a time only, return a date with this time.
    if (value.length <= 2) {
      const now = new Date()
      return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, second)
    }
  }

  // Strip day of the week from the string in English, French, or Spanish
  DAY_OF_WEEK_RE.lastIndex = 0
  value = value.replace(DAY_OF_WEEK_RE, '').trim()

  // Convert now and today to the current date at midnight
  const today = new Date(new Date().setHours(0, 0, 0, 0))
  if (/(now|today)/.test(value)) return today
  if (value.includes('tomorrow')) return new Date(today.setDate(today.getDate() + 1))

  // Handle a undelimited 6 or 8-digit number and treat it as YYYYMMDD
  if (value.length === 8) value = value.replace(/(\d\d\d\d)(\d\d)(\d\d)/, '$1-$2-$3')
  if (value.length === 6)
    value = value.replace(/(\d\d)(\d\d)(\d\d)/, yearToFull(value.slice(0, 2)) + '-$2-$3')

  try {
    ;({ year, month, day } = guessDateParts(value))
  } catch (e) {
    return new Date('')
  }

  // Return date (month is 0-based)
  return new Date(year, month - 1, day, hour, minute, second)
} // end parseDate

// Returns array of possible meanings for a token in a date string
// Pass an array of known parameters to exclude them from the guess
// Assumes months are 1-based.
export function guessDatePart(
  num: number,
  knownMeanings: (string | null)[] = [null, null, null]
): string[] {
  const unknown = (arr: string[]): string[] => arr.filter((i) => !knownMeanings.includes(i))

  if (num === 0 || num > 31) return unknown(['y'])
  if (num > 12) return unknown(['d', 'y'])
  if (num >= 1 && num <= 12) return unknown(['m', 'd', 'y'])
  return []
}

// Returns most likely meanings of each part of a date. Assumes 1-based months
export function guessDateParts(str: string): DateParts {
  const tokens = str.split(/[\s-/:.,]+/).filter((i) => i !== '')

  // If two tokens, add a year to the beginning
  if (tokens.length < 3) {
    // If one of the tokens is a 4-digit number, don't have enough info to guess the date
    if (str.match(/\d{4}/) !== null) throw new Error('Invalid Date')
    else tokens.unshift(String(new Date().getFullYear()))
  }

  const date: DateParts = { year: 0, month: 0, day: 0 }

  function assignPart(part: keyof DateParts, num: number): void {
    if (part === 'year') date.year = yearToFull(num)
    else date[part] = num
  }

  let count = 0
  while (!(date.year && date.month && date.day)) {
    tokenLoop: for (const token of tokens) {
      count++
      // If word
      if (/^[a-zA-Zé]+$/.test(token)) {
        if (!date.month) assignPart('month', monthToNumber(token) + 1)
        continue
      }

      // If the token is a year
      if (/^'\d\d$/.test(token) || /^\d{3,5}$/.test(token)) {
        if (!date.year) assignPart('year', parseInt(token.replace(/'/, '')))
        continue
      }

      // If the token is a number
      const num = parseInt(token)
      if (isNaN(num)) {
        console.error(`not date because ${token} isNaN`)
        throw new Error('Invalid Date')
      }

      const meanings = guessDatePart(num, [
        date.year ? 'y' : null,
        date.month ? 'm' : null,
        date.day ? 'd' : null,
      ])

      if (meanings.length == 1) {
        if (meanings[0] === 'm' && !date.month) {
          assignPart('month', num)
          continue tokenLoop
        }
        if (meanings[0] === 'd' && !date.day) {
          assignPart('day', num)
          continue tokenLoop
        }
        if (meanings[0] === 'y' && !date.year) {
          assignPart('year', num)
          continue tokenLoop
        }
      }

      // If we have no idea what the token is after going through all of them
      // set token to the first thing it could be starting with month
      if (count > 3) {
        if (!date.month && meanings.includes('m')) assignPart('month', num)
        else if (!date.day && meanings.includes('d')) assignPart('day', num)
        // If the previous two lines ran, the year will be assigned on the next iteration
      }
    }

    // Should never take more than six iterations to figure out a valid date
    if (count > 6) throw new Error('Invalid Date')
  }

  /* c8 ignore next 3 */
  if (date.year && date.month && date.day) return date
  throw new Error('Invalid Date')
}

// Accepts a string representing a time and returns an object with hour, minute, and second properties
export function parseTime(value: string): { hour: number; minute: number; second: number } | null {
  // if "now" or "today" is in the string, return the current time
  value = value.trim().toLowerCase()
  if (value === 'now') {
    const now = new Date()
    return { hour: now.getHours(), minute: now.getMinutes(), second: now.getSeconds() }
  }

  if (value === 'noon') return { hour: 12, minute: 0, second: 0 }

  // If there is a 3-4 digit number, assume it's a time and add a colon
  const timeParts = value.match(/(\d{3,4})/)

  if (timeParts) {
    const length = timeParts[1].length
    const hour = timeParts[1].slice(0, length == 3 ? 1 : 2)
    const minutes = timeParts[1].slice(-2)
    value = value.replace(timeParts[1], hour + ':' + minutes)
  }

  // Match a simple time without minutes or seconds and optional am/pm
  if (SHORT_TIME_RE.test(value)) {
    const shortParts = value.match(SHORT_TIME_RE)
    /* c8 ignore next */
    if (shortParts === null) return null
    value = shortParts[1] + ':' + (shortParts[2] || '00') + (shortParts[3] || '')
  }

  // Regex to match time in 0:0 format with optional seconds and am/pm
  if (!TIME_FULL_RE.test(value)) return null

  const parts = value.match(TIME_FULL_RE)
  /* c8 ignore next */
  if (parts === null) return null

  const hour = parseInt(parts[1])
  const minute = parseInt(parts[2])
  const second = parts[3] ? parseInt(parts[3]) : 0
  const ampm = parts[4]

  /* c8 ignore next */
  if (isNaN(hour) || isNaN(minute) || isNaN(second)) return null

  if (ampm === 'p' && hour < 12) return { hour: hour + 12, minute, second }
  if (ampm === 'a' && hour === 12) return { hour: 0, minute, second }

  /* c8 ignore next 3 */
  if (hour < 0 || hour > 23) return null
  if (minute < 0 || minute > 59) return null
  if (second < 0 || second > 59) return null

  return { hour, minute, second }
} // parseTime

export function parseTimeToString(value: string, format: string = 'h:mm A'): string {
  const time = parseTime(value)

  if (time) {
    const date = new Date()
    date.setHours(time.hour)
    date.setMinutes(time.minute)
    date.setSeconds(time.second)
    date.setMilliseconds(0)
    return formatDateTime(date, format)
  }

  return ''
}

// Parses a string and returns a date object with the most plausible date and time.
// This requires a time with a colon, and is not as robust for times as parseTime
export function parseDateTime(value: string | Date): Date | null {
  if (value instanceof Date) return value
  if (value.trim().length < 3) return null

  // Replace a capital T surrounded by numbers with a space
  value = value.replace(/(\d)T(\d)/, '$1 $2')

  let tokens = value.split(/[\s,]+/).filter((i) => i !== '')

  // Extract time and meridiem
  let dateToken = ''
  let timeToken = ''
  let meridiemToken = ''

  tokens.forEach((token, index) => {
    // Check for 1-4 digit number followed immediately by 'a' or 'p'
    const matches = token.match(/^(\d{1,4})([apAP]\.?[mM]?\.?)/)
    if (matches) timeToken = matches[0]
    else if (token.includes(':')) timeToken = token
    else if (token === 'now' || token === 'noon') timeToken = token

    if (isMeridiem(token)) {
      meridiemToken = token
      // Assume the token before it is a time, if it exists
      if (!timeToken && index > 0 && isTime(tokens[index - 1])) timeToken = tokens[index - 1]
    }
  })

  // If timeToken found, remove extracted tokens from array
  if (timeToken) tokens = tokens.filter((token) => token !== timeToken && token !== meridiemToken)
  else [dateToken, tokens] = findDateAndUnusedTokens(tokens)

  // Determine the time from found time tokens or remaining tokens if we know the date
  const timeInput = timeToken ? `${timeToken} ${meridiemToken}` : dateToken ? tokens.join(' ') : ''
  const time = parseTime(timeInput) || { hour: 0, minute: 0, second: 0 }
  const date = parseDate(dateToken ? dateToken : tokens.join(' ').trim() || 'today')

  if (!date || isNaN(date.getTime())) return null

  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    time.hour,
    time.minute,
    time.second
  )
} // end parseDateTime

// Returns the first date token found in an array of tokens and the remaining tokens
function findDateAndUnusedTokens(tokens: string[]): [string, string[]] {
  for (let numTokens = 3; numTokens > 0; numTokens--) {
    const potentialDate = tokens.slice(0, numTokens).join(' ')
    if (isDate(potentialDate)) return [potentialDate, tokens.slice(numTokens)]
  }
  return ['', tokens] // Return empty string and original tokens if no date found
}

// Accepts a date or date-like string and returns a formatted date string
// Uses moment-compatible format strings
export function formatDateTime(date: Date | string, format: string = 'YYYY-MM-DD'): string {
  // Ensure the date is a valid date object
  date = parseDate(date) as Date

  // if date is an invalid date object, return empty string
  /* c8 ignore next */
  if (isNaN(date.getTime())) return ''

  const d = {
    y: date.getFullYear(),
    M: date.getMonth(),
    D: date.getDate(),
    W: date.getDay(),
    H: date.getHours(),
    m: date.getMinutes(),
    s: date.getSeconds(),
    ms: date.getMilliseconds(),
  }

  const pad = (n: number | string, w = 2) => (n + '').padStart(w, '0')

  const getH = () => d.H % 12 || 12

  const getMeridiem = (hour: number) => (hour < 12 ? 'AM' : 'PM')

  const monthToString = (month: number) =>
    'January|February|March|April|May|June|July|August|September|October|November|December'.split(
      '|'
    )[month]

  function dayToString(day: number, len: number = 0): string {
    const days = 'Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday'.split('|')
    return len ? days[day].slice(0, len) : days[day]
  }

  const matches: { [key: string]: string | number } = {
    YY: String(d.y).slice(-2),
    YYYY: d.y,
    M: d.M + 1,
    MM: pad(d.M + 1),
    MMMM: monthToString(d.M),
    MMM: monthToString(d.M).slice(0, 3),
    D: String(d.D),
    DD: pad(d.D),
    d: String(d.W),
    dd: dayToString(d.W, 2),
    ddd: dayToString(d.W, 3),
    dddd: dayToString(d.W),
    H: String(d.H),
    HH: pad(d.H),
    h: getH(),
    hh: pad(getH()),
    A: getMeridiem(d.H),
    a: getMeridiem(d.H).toLowerCase(),
    m: String(d.m),
    mm: pad(d.m),
    s: String(d.s),
    ss: pad(d.s),
    SSS: pad(d.ms, 3),
  }

  return format.replace(
    /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,
    (match, $1) => $1 || matches[match]
  )
} // end formatDateTime

export function parseDateToString(value: string | Date, format?: string): string {
  const date = parseDate(value)
  if (isNaN(date.getTime())) return ''
  // if the format is undefined or has length of 0, set it to the default format
  if (!format || format.length === 0) format = 'YYYY-MMM-DD'
  return formatDateTime(date, format)
}

export function parseDateTimeToString(value: string | Date, format?: string): string {
  const dateTime = parseDateTime(value)
  if (dateTime === null || isNaN(dateTime.getTime())) return ''
  // if the format is undefined or has length of 0, set it to the default format
  if (!format || format.length === 0) format = 'YYYY-MMM-DD h:mm A'
  return formatDateTime(dateTime, format)
}

// Check if a the value of a specified input is a valid date and is in a specified date range
export function isDate(value: string | Date): boolean {
  if (typeof value !== 'string' && !(value instanceof Date)) return false
  let date = parseDate(value)

  /* c8 ignore next */
  if (date === null || date === undefined) return false

  return !isNaN(date.getTime())
}

// Check if the value of an input validates as a date with time
export function isDateTime(value: string | Date): boolean {
  if (typeof value !== 'string' && !(value instanceof Date)) return false

  let dateTime = parseDateTime(value)

  /* c8 ignore next */
  if (dateTime === null || dateTime === undefined) return false

  return !isNaN(dateTime.getTime())
}

// Check if a date is within the specified range
export function isDateInRange(date: Date, range: string): boolean {
  if (range === 'past' && date > new Date()) return false
  if (range === 'future' && date.getTime() < new Date().setHours(0, 0, 0, 0)) return false

  // In the future, may add support for ranges like 'last 30 days' or 'next 3 months'
  // or specific dates like '2019-01-01 to 2019-12-31'
  return true
}

// Checks if a given string is a representation of a meridiem.
export function isMeridiem(token: string): boolean {
  // Normalize the token for easier comparison
  const normalizedToken = token.toLowerCase().replace(/[.\s]/g, '')
  return ['am', 'pm', 'a', 'p'].includes(normalizedToken)
}

export function isTime(value: string): boolean {
  let timeObj = parseTime(value)

  if (timeObj === null) return false

  return !isNaN(timeObj.hour) && !isNaN(timeObj.minute) && !isNaN(timeObj.second)
}

// Input validation for email fields
export function isEmail(value: string): boolean {
  // Emails cannot be longer than 255 characters
  if (value.length > 255) return false

  // Quick check for valid TLD format before running the full regex
  if (!EMAIL_TLD_RE.test(value)) return false

  return EMAIL_FULL_RE.test(value)
}

// Parse a North American Numbering Plan phone number (xxx-xxx-xxxx)
export function parseNANPTel(value: string): string {
  // first character regex, strip anything that isn't part of the area code
  value = value.replace(/^[^2-90]+/g, '')
  // now the first number should be for the area code
  value = value.replace(/(\d\d\d).*?(\d\d\d).*?(\d\d\d\d)(.*)/, '$1-$2-$3$4')

  return value
}

// Checks that the phone number is valid in North American Numbering Plan
export function isNANPTel(value: string): boolean {
  return /^\d\d\d-\d\d\d-\d\d\d\d$/.test(value)
}

export function parseInteger(value: string): string {
  return value.replace(/[^0-9]/g, '')
}

export function isNumber(value: string): boolean {
  return /^\-?\d*\.?\d*$/.test(value)
}

export function parseNumber(value: string): string {
  return value
    .replace(/[^\-0-9.]/g, '') // all but digits, hyphens, and periods
    .replace(/(^-)|(-)/g, (_match, p1) => (p1 ? '-' : '')) // all but the first hyphen
    .replace(/(\..*)\./g, '$1') // periods after a first one
}

export function isInteger(value: string): boolean {
  return /^\-?\d*$/.test(value)
}

// If the string isn't already a valid url, prepends 'https://'
export function parseUrl(value: string): string {
  value = value.trim()
  if (URL_PARSE_RE.test(value)) return value
  else return 'https://' + value
}

// Checks if this is a valid URL in a protocol agnostic way,
// allows for protocol-relative absolute URLs (eg //example.com)
export function isUrl(value: string): boolean {
  return URL_VALIDATE_RE.test(value)
}

export function parseZip(value: string): string {
  value = value
    .replace(/[^0-9]/g, '')
    .replace(/(.{5})(.*)/, '$1-$2')
    .trim()

  // If the zip code has 6 characters, remove a hyphen
  if (value.length === 6) value = value.replace(/-/, '')

  return value
}

export function isZip(value: string): boolean {
  return ZIP_RE.test(value)
}

export function parsePostalCA(value: string): string {
  /* c8 ignore next */
  value = value
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .replace(/(.{3})\s*(.*)/, '$1 $2')
    .trim()
  return value
}

export function isPostalCA(value: string): boolean {
  return POSTAL_CA_RE.test(value)
}

// Checks if the value is a valid CSS color using CSS.supports()
// Requires a modern browser environment (97%+ browser support)
export function isColor(value: string): boolean {
  if (['transparent', 'currentColor'].includes(value)) return true

  /* c8 ignore next */
  if (typeof value !== 'string' || !value.trim()) return false

  /* c8 ignore next 2 */
  if (typeof CSS !== 'object' || typeof CSS.supports !== 'function') return false

  return CSS.supports('color', value)
}

// Used to convert color names to hex values
let colorCanvas: HTMLCanvasElement | null = null

// Cache of color names to hex values to reduce reads to canvas
const colorCache = new Map<string, string>()

// Uses a Canvas element to convert a color name to a hex value
export function parseColor(value: string): string {
  value = value.trim().toLowerCase()

  if (['transparent', 'currentcolor'].includes(value)) return value

  if (colorCache.has(value)) return colorCache.get(value)!

  if (colorCanvas === null) {
    colorCanvas = document.createElement('canvas')
    // May improve performance (or suppress warnings) but I don't think it does much
    ;(<any>colorCanvas).willReadFrequently = true
  }
  let ctx = colorCanvas.getContext('2d')
  /* c8 ignore next */
  if (!ctx) throw new Error("Can't get context from colorCanvas")

  ctx!.fillStyle = value
  ctx!.fillRect(0, 0, 1, 1)
  let d = ctx!.getImageData(0, 0, 1, 1).data
  let hex = '#' + ('000000' + ((d[0] << 16) | (d[1] << 8) | d[2]).toString(16)).slice(-6)

  colorCache.set(value, hex)

  return hex
}

// Homogenizes the return of a custom validation function to a ValidationResult
// that has a boolean valid property and messages array of strings
export function normalizeValidationResult(
  res:
    | boolean
    | string
    | { valid: boolean; message?: string; messages?: string | string[]; error?: boolean }
): ValidationResult {
  let result: ValidationResult = { valid: false, error: false, messages: [] }
  if (typeof res === 'boolean') return { valid: res, error: false, messages: [] }
  if (typeof res === 'string') return { valid: false, error: false, messages: [res] }
  if (typeof res.valid === 'boolean') result.valid = res.valid
  if (typeof res.message === 'string') result.messages = [res.message]
  if (typeof res.messages === 'string') result.messages = [res.messages]
  if (Array.isArray(res.messages)) result.messages = res.messages
  if (res.error === true) result.error = true

  return result
}
