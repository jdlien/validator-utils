import * as utils from '../src/validator-utils'
// @ts-ignore
import { describe, it, expect } from 'vitest'

type Rng = () => number

function mulberry32(seed: number): Rng {
  let t = seed >>> 0
  return () => {
    t += 0x6d2b79f5
    let r = Math.imul(t ^ (t >>> 15), t | 1)
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

function randInt(rng: Rng, max: number): number {
  return Math.floor(rng() * max)
}

function randChoice<T>(rng: Rng, items: readonly T[]): T {
  return items[randInt(rng, items.length)]
}

function randString(rng: Rng, maxLen: number, charset: string): string {
  const len = randInt(rng, maxLen + 1)
  let out = ''
  for (let i = 0; i < len; i += 1) out += charset[randInt(rng, charset.length)]
  return out
}

const CHARSET =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 -_/:,.@#%+()[]{}!$^&*;'\"\\|<>?~"
const CHARSET_CHARS = CHARSET.split('')

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'] as const
const DATE_SEPS = ['-', '/', '.', ' '] as const
const MERIDIEMS = ['a', 'p', 'am', 'pm', 'a.m.', 'p.m.', 'A', 'P', 'AM', 'PM'] as const

function pad2(n: number): string {
  return String(n).padStart(2, '0')
}

function randomDateLike(rng: Rng): string {
  const year = 1900 + randInt(rng, 200)
  const shortYear = String(year).slice(-2)
  const month = randInt(rng, 12) + 1
  const day = randInt(rng, 31) + 1
  const sep = randChoice(rng, DATE_SEPS)
  const monthName = randChoice(rng, MONTHS)

  switch (randInt(rng, 10)) {
    case 0:
      return `${year}${sep}${month}${sep}${day}`
    case 1:
      return `${month}${sep}${day}${sep}${shortYear}`
    case 2:
      return `${day}${sep}${month}${sep}${year}`
    case 3:
      return `${year}${pad2(month)}${pad2(day)}`
    case 4:
      return `${shortYear}${pad2(month)}${pad2(day)}`
    case 5:
      return `${monthName} ${day} ${year}`
    case 6:
      return `${day} ${monthName} ${shortYear}`
    case 7:
      return `'${shortYear} ${month} ${day}`
    case 8:
      return randChoice(rng, ['today', 'tomorrow', 'now'])
    case 9:
      return `${monthName}${sep}${day}${sep}${shortYear}`
    default:
      return `${year}-${month}-${day}`
  }
}

function randomTimeLike(rng: Rng): string {
  const hour = randInt(rng, 24)
  const minute = randInt(rng, 60)
  const second = randInt(rng, 60)
  const useSeconds = rng() < 0.3
  const useColons = rng() < 0.7
  const useMeridiem = rng() < 0.4
  const minuteStr = rng() < 0.5 ? String(minute) : pad2(minute)
  const secondStr = rng() < 0.5 ? String(second) : pad2(second)
  let out = ''

  if (useColons) {
    out = `${hour}:${minuteStr}`
    if (useSeconds) out += `:${secondStr}`
  } else {
    const h = rng() < 0.5 ? String(hour) : pad2(hour)
    out = `${h}${pad2(minute)}`
  }

  if (useMeridiem) {
    out += rng() < 0.5 ? '' : ' '
    out += randChoice(rng, MERIDIEMS)
  }

  return out
}

function randomDateTimeLike(rng: Rng): string {
  const date = randomDateLike(rng)
  const time = randomTimeLike(rng)
  if (rng() < 0.5) return `${date} ${time}`
  if (/\d/.test(date) && /\d/.test(time) && rng() < 0.3) return `${date}T${time}`
  return `${time} ${date}`
}

function mutateString(rng: Rng, input: string): string {
  let out = input
  const ops = randInt(rng, 3) + 1
  for (let i = 0; i < ops; i += 1) {
    if (!out) out = randString(rng, 1, CHARSET)
    const idx = randInt(rng, out.length)
    const action = randInt(rng, 3)
    if (action === 0) {
      // Insert a random character
      out = out.slice(0, idx) + randChoice(rng, CHARSET_CHARS) + out.slice(idx)
    } else if (action === 1) {
      // Delete a character
      out = out.slice(0, idx) + out.slice(idx + 1)
    } else {
      // Replace a character
      out = out.slice(0, idx) + randChoice(rng, CHARSET_CHARS) + out.slice(idx + 1)
    }
  }
  return out
}

function buildFuzzInputs(rng: Rng, count: number): string[] {
  const inputs: string[] = [
    '',
    ' ',
    '   ',
    '0',
    '00',
    '0000',
    '99999999',
    '19990229',
    '20010203',
    '2001-02-29',
    '12/31/99',
    '31/12/99',
    'Feb 30 2001',
    '13:99',
    '24:00',
    '12:00 AM',
    '12:00 PM',
    '1p',
    '1:2:3',
    'today 11:59 PM',
    'tomorrow 00:00',
    'now',
    'noon',
  ]

  for (let i = 0; i < count; i += 1) {
    const type = randInt(rng, 4)
    let base = ''
    if (type === 0) base = randomDateLike(rng)
    else if (type === 1) base = randomTimeLike(rng)
    else if (type === 2) base = randomDateTimeLike(rng)
    else base = randString(rng, 64, CHARSET)

    inputs.push(base)
    if (rng() < 0.6) inputs.push(mutateString(rng, base))
  }

  inputs.push(randString(rng, 512, CHARSET))
  return inputs
}

function assertNoThrow(label: string, input: string, fn: () => void): void {
  try {
    fn()
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    throw new Error(`${label} threw for input: ${JSON.stringify(input)} (${message})`)
  }
}

describe('fuzz', () => {
  it('does not throw on random date/time inputs', () => {
    const rng = mulberry32(0xdecafbad)
    const inputs = buildFuzzInputs(rng, 1000)

    for (const input of inputs) {
      assertNoThrow('parseTime', input, () => {
        utils.parseTime(input)
      })
      assertNoThrow('parseDate', input, () => {
        utils.parseDate(input)
      })
      assertNoThrow('parseDateTime', input, () => {
        utils.parseDateTime(input)
      })
      assertNoThrow('parseTimeToString', input, () => {
        utils.parseTimeToString(input)
      })
      assertNoThrow('parseDateToString', input, () => {
        utils.parseDateToString(input)
      })
      assertNoThrow('parseDateTimeToString', input, () => {
        utils.parseDateTimeToString(input)
      })
      assertNoThrow('isTime', input, () => {
        utils.isTime(input)
      })
      assertNoThrow('isDate', input, () => {
        utils.isDate(input)
      })
      assertNoThrow('isDateTime', input, () => {
        utils.isDateTime(input)
      })

      const dt = utils.parseDateTime(input)
      if (dt) expect(Number.isNaN(dt.getTime())).toBe(false)
    }
  })

  it('keeps numeric and URL invariants under fuzz', () => {
    const rng = mulberry32(0x9e3779b9)
    const inputs = buildFuzzInputs(rng, 1000)

    for (const input of inputs) {
      assertNoThrow('parseInteger', input, () => {
        const parsed = utils.parseInteger(input)
        expect(utils.isInteger(parsed)).toBe(true)
      })
      assertNoThrow('parseNumber', input, () => {
        const parsed = utils.parseNumber(input)
        expect(utils.isNumber(parsed)).toBe(true)
      })
      assertNoThrow('parseUrl', input, () => {
        const parsed = utils.parseUrl(input)
        expect(utils.isUrl(parsed)).toBe(true)
      })
      assertNoThrow('parsePostalCA', input, () => {
        const parsed = utils.parsePostalCA(input)
        expect(/^[A-Z0-9 ]*$/.test(parsed)).toBe(true)
        if (parsed.length > 3) expect(parsed[3]).toBe(' ')
      })
      assertNoThrow('parseNANPTel', input, () => {
        utils.parseNANPTel(input)
      })
      assertNoThrow('isEmail', input, () => {
        const res = utils.isEmail(input)
        expect(typeof res).toBe('boolean')
      })
      assertNoThrow('isUrl', input, () => {
        const res = utils.isUrl(input)
        expect(typeof res).toBe('boolean')
      })
      assertNoThrow('isMeridiem', input, () => {
        const res = utils.isMeridiem(input)
        expect(typeof res).toBe('boolean')
      })
    }
  })

  it('normalizes validation results for random inputs', () => {
    const rng = mulberry32(0x12345678)

    for (let i = 0; i < 500; i += 1) {
      const type = randInt(rng, 6)
      let input: any
      if (type === 0) input = rng() < 0.5
      else if (type === 1) input = randString(rng, 32, CHARSET)
      else if (type === 2) input = { valid: rng() < 0.5 }
      else if (type === 3) input = { valid: rng() < 0.5, message: randString(rng, 16, CHARSET) }
      else if (type === 4)
        input = {
          valid: rng() < 0.5,
          messages: rng() < 0.5 ? randString(rng, 16, CHARSET) : [randString(rng, 8, CHARSET), randString(rng, 8, CHARSET)],
        }
      else input = { valid: rng() < 0.5, error: rng() < 0.5 }

      assertNoThrow('normalizeValidationResult', JSON.stringify(input), () => {
        const normalized = utils.normalizeValidationResult(input)
        expect(Array.isArray(normalized.messages)).toBe(true)
      })
    }
  })
})
