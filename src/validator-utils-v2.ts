/**
 * Validator Utils V2 - Ultra-lightweight rewrite
 * Focus: Minimal code size while maintaining ~95% test compatibility
 */

// ============ TIME PARSING ============

export function parseTime(value: string): { hour: number; minute: number; second: number } | null {
  let v = value.trim().toLowerCase()
  if (v === 'now') {
    const n = new Date()
    return { hour: n.getHours(), minute: n.getMinutes(), second: n.getSeconds() }
  }
  if (v === 'noon') return { hour: 12, minute: 0, second: 0 }

  // Remove trailing dots/spaces: "5:0P" -> "5:0p", "1 PM" -> "1pm"
  v = v.replace(/\s+/g, '').replace(/\.+$/g, '')

  // Normalize: "130" -> "1:30", "1430" -> "14:30", "1200am" -> "12:00am"
  let s = v.replace(/^(\d{1,2})(\d{2})([ap]?m?\.?)$/i, '$1:$2$3')

  // Match time: 1:30, 13:00, 1:30:45, 1pm, 1:30pm, 1:5, 5:0p etc.
  const m = s.match(/^(\d{1,2})(?::(\d{1,2}))?(?::(\d{1,2}))?\s*([ap])?\.?m?\.?$/i)
  if (!m) return null

  let hour = +m[1], minute = +(m[2] || 0), second = +(m[3] || 0)
  const ap = m[4]?.toLowerCase()

  if (ap === 'p' && hour < 12) hour += 12
  if (ap === 'a' && hour === 12) hour = 0
  if (hour > 23 || minute > 59 || second > 59) return null

  return { hour, minute, second }
}

export function isTime(value: string): boolean {
  return parseTime(value) !== null
}

export function isMeridiem(token: string): boolean {
  return /^[ap]\.?m?\.?$/i.test(token.replace(/\s/g, ''))
}

// ============ DATE PARSING ============

const MONTHS = 'jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec'
const MONTH_RE = new RegExp(`(${MONTHS})[a-z]*`, 'i')

function monthToNum(s: string): number {
  const m = new Date(`1 ${s} 2000`).getMonth()
  return isNaN(m) ? -1 : m
}

export function yearToFull(y: number | string): number {
  if (typeof y === 'string') y = parseInt(y.replace(/\D/g, ''))
  if (y > 99) return y
  const cutoff = (new Date().getFullYear() + 20) % 100
  return y + (y < cutoff ? 2000 : 1900)
}

export function parseDate(value: string | Date): Date {
  if (value instanceof Date) return value
  let v = value.trim().toLowerCase()

  // Special keywords
  const today = new Date(new Date().setHours(0, 0, 0, 0))
  if (/^(now|today)$/.test(v)) return today
  if (v === 'tomorrow') return new Date(today.setDate(today.getDate() + 1))

  // Strip weekday names
  v = v.replace(/\b(mon|tue|wed|thu|fri|sat|sun)[a-z]*\.?\b/gi, '').trim()

  // Extract time if present
  let hour = 0, minute = 0, second = 0
  const timeMatch = v.match(/(\d{1,2}:\d{2}(?::\d{2})?\s*[ap]?\.?m?\.?)/i)
  if (timeMatch) {
    const t = parseTime(timeMatch[1])
    if (t) ({ hour, minute, second } = t)
    v = v.replace(timeMatch[0], '').trim()
    // If only time remains, return today with that time
    if (!v || v.length <= 2) {
      const now = new Date()
      return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, second)
    }
  }

  // Handle 8-digit YYYYMMDD
  if (/^\d{8}$/.test(v)) {
    return new Date(+v.slice(0, 4), +v.slice(4, 6) - 1, +v.slice(6, 8), hour, minute, second)
  }

  // Handle 6-digit YYMMDD
  if (/^\d{6}$/.test(v)) {
    return new Date(yearToFull(+v.slice(0, 2)), +v.slice(2, 4) - 1, +v.slice(4, 6), hour, minute, second)
  }

  // Try to extract month name first
  const monthMatch = v.match(MONTH_RE)
  let month = -1, year = 0, day = 0

  if (monthMatch) {
    month = monthToNum(monthMatch[1])
    v = v.replace(monthMatch[0], ' ').trim()
  }

  // Handle apostrophe years like '02 - extract before getting other numbers
  const apoMatch = v.match(/'(\d{2})\b/)
  if (apoMatch) {
    year = yearToFull(+apoMatch[1])
    v = v.replace(apoMatch[0], ' ').trim()
  }

  // Extract remaining numbers
  const nums = v.match(/\d+/g)?.map(Number) || []

  if (month >= 0) {
    // Have month name, need day and possibly year
    if (nums.length >= 2) {
      // Two numbers: figure out which is year, which is day
      // Year > 99 (4-digit), day <= 31
      if (nums[0] > 99) { year = nums[0]; day = nums[1] }
      else if (nums[1] > 99) { year = nums[1]; day = nums[0] }
      else if (nums[0] > 31) { day = nums[1]; year = yearToFull(nums[0]) }
      else if (nums[1] > 31) { day = nums[0]; year = yearToFull(nums[1]) }
      else { day = nums[0]; year = year || yearToFull(nums[1]) }
    } else if (nums.length === 1) {
      day = nums[0]; year = year || new Date().getFullYear()
    }
  } else if (nums.length >= 3) {
    // Three numbers, no month name
    const [a, b, c] = nums
    if (a > 31) { year = a; month = b - 1; day = c }  // YYYY-MM-DD
    else if (a > 12 && c > 12) { day = a; month = b - 1; year = c > 31 ? c : yearToFull(c) }  // DD-MM-YYYY (a can't be month)
    else if (c > 31 || c > 12) { month = a - 1; day = b; year = c > 31 ? c : yearToFull(c) }  // MM-DD-YYYY or MM-DD-YY
    else if (b > 12) { month = a - 1; day = b; year = yearToFull(c) }  // M-DD-YY
    else { month = a - 1; day = b; year = yearToFull(c) }  // Ambiguous: assume M/D/Y
  } else if (nums.length === 2) {
    // Two numbers, no month name - use year if already set (from apostrophe), else current year
    month = nums[0] - 1; day = nums[1]; year = year || new Date().getFullYear()
  }

  // Validate basic day range (allow JS Date to handle month-specific rollover)
  if (year && month >= 0 && day && day >= 1 && day <= 31) {
    return new Date(year > 99 ? year : yearToFull(year), month, day, hour, minute, second)
  }

  return new Date('')  // Invalid
}

// ============ DATETIME PARSING ============

export function parseDateTime(value: string | Date): Date | null {
  if (value instanceof Date) return value
  let v = value.trim()
  if (v.length < 3) return null

  // Normalize ISO T separator
  v = v.replace(/(\d)T(\d)/i, '$1 $2')

  // Special: "now" returns current time
  if (/^now$/i.test(v)) {
    const now = new Date()
    now.setMilliseconds(0)
    return now
  }

  // Special: "noon" returns today at 12:00
  if (/^noon$/i.test(v)) {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0)
  }

  let time: { hour: number; minute: number; second: number } | null = null
  let dateStr = v

  // Check for "noon" within the string
  const noonMatch = v.match(/\bnoon\b/i)
  if (noonMatch) {
    time = { hour: 12, minute: 0, second: 0 }
    dateStr = v.replace(noonMatch[0], ' ').replace(/\s+/g, ' ').trim()
  }

  // Try to find and extract time portion - order matters!
  if (!time) {
    const timePatterns = [
      /(\d{1,2}:\d{1,2}(?::\d{2})?)\s*([ap]\.?m?\.?)?/i,  // 14:30, 2:30pm, 1:5
      /\b(\d{1,2})\s*([ap]\.?m?\.?)\b/i,  // 2pm, 2p.m., 2 PM, 1P
      /\b(\d{3,4})([ap])m?\b/i,  // 1430pm, 230p, 1200AM
    ]

    for (const re of timePatterns) {
      const m = v.match(re)
      if (m) {
        const parsed = parseTime(m[0])
        if (parsed) {
          time = parsed
          // Remove match and cleanup trailing punctuation/whitespace
          dateStr = v.replace(m[0], ' ').replace(/[\s.]+$/g, '').replace(/\s+/g, ' ').trim()
          break
        }
      }
    }
  }

  // Check for bare time after year-first date (e.g., "2023-09-25 1200", "20230925 13", "20230925 12 a.m.")
  if (!time) {
    const yearFirstMatch = dateStr.match(/^(\d{4}[\-\/\.\s]\d{1,2}[\-\/\.\s]\d{1,2}|\d{8})\s+(\d{1,4})(\s*[ap]\.?m?\.?)?$/i)
    if (yearFirstMatch) {
      // Combine time digits with meridiem (handling space between them)
      const timeStr = (yearFirstMatch[2] + (yearFirstMatch[3] || '')).replace(/\s+/g, '')
      const parsed = parseTime(timeStr)
      if (parsed) {
        time = parsed
        dateStr = yearFirstMatch[1]
      }
    }
  }

  // Handle trailing bare time after date with month name (e.g., "2023 September 25 13")
  if (!time) {
    const trailingTimeMatch = dateStr.match(/^(.+?)\s+(\d{1,2})(\s*[ap]\.?m?\.?)?$/i)
    if (trailingTimeMatch) {
      const potentialTime = trailingTimeMatch[2] + (trailingTimeMatch[3] || '')
      const parsed = parseTime(potentialTime)
      // Only use as time if the remaining date has a month name (to avoid confusion with day)
      if (parsed && MONTH_RE.test(trailingTimeMatch[1])) {
        time = parsed
        dateStr = trailingTimeMatch[1]
      }
    }
  }

  // Also check for meridiem token that might be separate
  if (time) {
    const meridMatch = dateStr.match(/\b([ap])\.?m?\.?\b/i)
    if (meridMatch) {
      const ap = meridMatch[1].toLowerCase()
      if (ap === 'p' && time.hour < 12) time.hour += 12
      if (ap === 'a' && time.hour === 12) time.hour = 0
      dateStr = dateStr.replace(meridMatch[0], ' ').trim()
    }
  }

  // Handle standalone time (no date left)
  if (!dateStr || /^,?\s*$/.test(dateStr)) {
    const now = new Date()
    const t = time || { hour: 0, minute: 0, second: 0 }
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), t.hour, t.minute, t.second)
  }

  const date = parseDate(dateStr)
  if (isNaN(date.getTime())) return null

  // Validate that the date is reasonable (not rolled over from invalid input)
  const t = time || { hour: 0, minute: 0, second: 0 }
  const result = new Date(date.getFullYear(), date.getMonth(), date.getDate(), t.hour, t.minute, t.second)

  // Check for rollover (e.g., day 32 becoming next month)
  if (result.getMonth() !== date.getMonth()) return null

  return result
}

// ============ DATE FORMATTING ============

export function formatDateTime(date: Date | string, format = 'YYYY-MM-DD'): string {
  if (typeof date === 'string') date = parseDate(date)
  if (isNaN(date.getTime())) return ''

  const y = date.getFullYear(), M = date.getMonth(), D = date.getDate()
  const W = date.getDay(), H = date.getHours(), m = date.getMinutes()
  const s = date.getSeconds(), ms = date.getMilliseconds()

  const pad = (n: number, w = 2) => String(n).padStart(w, '0')
  const h = H % 12 || 12
  const ap = H < 12 ? 'AM' : 'PM'
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December']
  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']

  const tokens: Record<string, string | number> = {
    YYYY: y, YY: String(y).slice(-2),
    MMMM: months[M], MMM: months[M].slice(0, 3), MM: pad(M + 1), M: M + 1,
    DD: pad(D), D,
    dddd: days[W], ddd: days[W].slice(0, 3), dd: days[W].slice(0, 2), d: W,
    HH: pad(H), H, hh: pad(h), h,
    mm: pad(m), m, ss: pad(s), s, SSS: pad(ms, 3),
    A: ap, a: ap.toLowerCase(),
  }

  return format.replace(/\[([^\]]+)]|YYYY|YY|MMMM|MMM|MM|M|DD|D|dddd|ddd|dd|d|HH|H|hh|h|mm|m|ss|s|SSS|A|a/g,
    (match, escaped) => escaped ?? String(tokens[match] ?? match))
}

// ============ VALIDATION HELPERS ============

export function isDate(value: string | Date): boolean {
  if (typeof value !== 'string' && !(value instanceof Date)) return false
  return !isNaN(parseDate(value).getTime())
}

export function isDateTime(value: string | Date): boolean {
  if (typeof value !== 'string' && !(value instanceof Date)) return false
  const dt = parseDateTime(value)
  return dt !== null && !isNaN(dt.getTime())
}

export function parseDateToString(value: string | Date, format = 'YYYY-MMM-DD'): string {
  const date = parseDate(value)
  return isNaN(date.getTime()) ? '' : formatDateTime(date, format)
}

export function parseDateTimeToString(value: string | Date, format = 'YYYY-MMM-DD h:mm A'): string {
  const dt = parseDateTime(value)
  return dt && !isNaN(dt.getTime()) ? formatDateTime(dt, format) : ''
}

export function parseTimeToString(value: string, format = 'h:mm A'): string {
  const t = parseTime(value)
  if (!t) return ''
  const d = new Date()
  d.setHours(t.hour, t.minute, t.second, 0)
  return formatDateTime(d, format)
}

// ============ UTILITY EXPORTS (for compatibility) ============

export function monthToNumber(str: string | number): number {
  if (typeof str === 'number') return str - 1
  const num = parseInt(str)
  if (!isNaN(num)) return num - 1
  const m = new Date(`1 ${str} 2000`).getMonth()
  if (!isNaN(m)) return m
  throw new Error('Invalid month name: ' + str)
}

export function guessDatePart(num: number, known: (string | null)[] = []): string[] {
  const unknown = (arr: string[]) => arr.filter(i => !known.includes(i))
  if (num === 0 || num > 31) return unknown(['y'])
  if (num > 12) return unknown(['d', 'y'])
  if (num >= 1 && num <= 12) return unknown(['m', 'd', 'y'])
  return []
}

export function guessDateParts(str: string): { year: number; month: number; day: number } {
  const d = parseDate(str)
  if (isNaN(d.getTime())) throw new Error('Invalid Date')
  return { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() }
}

export function isDateInRange(date: Date, range: string): boolean {
  if (range === 'past' && date > new Date()) return false
  if (range === 'future' && date.getTime() < new Date().setHours(0, 0, 0, 0)) return false
  return true
}
