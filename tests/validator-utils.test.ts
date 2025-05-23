import * as utils from '../src/validator-utils'
// @ts-ignore
import { describe, it, expect, vi, beforeEach } from 'vitest'
type DateParts = { year: number; month: number; day: number }

describe('utils', () => {
  describe('isFormControl', () => {
    it('should return true if the element is an instance of HTMLInputElement', () => {
      const input = document.createElement('input')
      expect(utils.isFormControl(input)).toBe(true)
    })

    it('should return true if the element is an instance of HTMLSelectElement', () => {
      const select = document.createElement('select')
      expect(utils.isFormControl(select)).toBe(true)
    })

    it('should return true if the element is an instance of HTMLTextAreaElement', () => {
      const textarea = document.createElement('textarea')
      expect(utils.isFormControl(textarea)).toBe(true)
    })

    it('should return false if the element is not an instance of HTMLInputElement, HTMLSelectElement or HTMLTextAreaElement', () => {
      const div = document.createElement('div')
      expect(utils.isFormControl(div)).toBe(false)
    })
  }) // end isFormControl

  describe('isType', () => {
    let inputElement: HTMLInputElement
    let textAreaElement: HTMLTextAreaElement

    beforeEach(() => {
      inputElement = document.createElement('input')
      textAreaElement = document.createElement('textarea')
    })

    it('should return true for matching data-type attribute', () => {
      inputElement.setAttribute('data-type', 'text')
      expect(utils.isType(inputElement, 'text')).toBe(true)
    })

    it('should return true for matching type attribute', () => {
      inputElement.setAttribute('type', 'text')
      expect(utils.isType(inputElement, 'text')).toBe(true)
    })

    it('should return true for matching type attribute', () => {
      inputElement.setAttribute('type', 'radio')
      expect(utils.isType(inputElement, ['radio', 'checkbox'])).toBe(true)
    })

    it('should return true for matching data-type or type attribute in an array of types', () => {
      textAreaElement.setAttribute('data-type', 'textarea')
      inputElement.setAttribute('type', 'text')
      expect(utils.isType(textAreaElement, ['text', 'textarea'])).toBe(true)
      expect(utils.isType(inputElement, ['text', 'textarea'])).toBe(true)
    })

    it('should return false for non-matching data-type and type attribute', () => {
      inputElement.setAttribute('type', 'email')
      inputElement.setAttribute('data-type', 'email')
      expect(utils.isType(inputElement, 'text')).toBe(false)
      expect(utils.isType(textAreaElement, 'text')).toBe(false)
    })
  }) // end isType

  describe('momentToFPFormat', () => {
    it('should correctly convert YYYY to Y', () => {
      expect(utils.momentToFPFormat('YYYY-MM-DD')).toEqual('Y-m-d')
    })

    it('should correctly convert YY to y', () => {
      expect(utils.momentToFPFormat('YY-MM-DD')).toEqual('y-m-d')
    })

    it('should correctly convert MMMM to F', () => {
      expect(utils.momentToFPFormat('YYYY-MMMM-DD')).toEqual('Y-F-d')
    })

    it('should correctly convert MMM to M', () => {
      expect(utils.momentToFPFormat('YYYY-MMM-DD')).toEqual('Y-M-d')
    })

    it('should correctly convert MM to m', () => {
      expect(utils.momentToFPFormat('YYYY-MM-DD')).toEqual('Y-m-d')
    })

    it('should correctly convert M to n', () => {
      expect(utils.momentToFPFormat('YYYY-M-DD')).toEqual('Y-n-d')
    })

    it('should correctly convert DD to d', () => {
      expect(utils.momentToFPFormat('YYYY-MM-DD')).toEqual('Y-m-d')
    })

    it('should correctly convert D to j', () => {
      expect(utils.momentToFPFormat('YYYY-MM-D')).toEqual('Y-m-j')
    })

    it('should correctly convert dddd to l', () => {
      expect(utils.momentToFPFormat('dddd, MMMM DD YYYY')).toEqual('l, F d Y')
    })

    it('should correctly convert ddd to D', () => {
      expect(utils.momentToFPFormat('ddd, MMM DD YYYY')).toEqual('D, M d Y')
    })

    it('should correctly convert dd to D', () => {
      expect(utils.momentToFPFormat('dd, MMM DD YYYY')).toEqual('D, M d Y')
    })

    it('should correctly convert d to w', () => {
      expect(utils.momentToFPFormat('d, MMM DD YYYY')).toEqual('w, M d Y')
    })

    it('should correctly convert HH to H', () => {
      expect(utils.momentToFPFormat('HH:mm:ss')).toEqual('H:i:S')
    })

    it('should correctly convert H to G', () => {
      expect(utils.momentToFPFormat('H:mm:ss')).toEqual('G:i:S')
    })

    it('should correctly convert 12hr hh to h unpadded', () => {
      expect(utils.momentToFPFormat('h:m:s')).toEqual('h:i:s')
    })

    it('should correctly convert 12hr hh to h padded', () => {
      expect(utils.momentToFPFormat('hh:mm:ss')).toEqual('h:i:S')
    })
  }) // momentToFPFormat

  describe('monthToNumber', () => {
    it('returns the correct zero-based month number for numeric input', () => {
      expect(utils.monthToNumber(1)).toEqual(0)
      expect(utils.monthToNumber('2')).toEqual(1)
      expect(utils.monthToNumber('12')).toEqual(11)
    })

    it('returns the correct zero-based month number for string input', () => {
      expect(utils.monthToNumber('January')).toEqual(0)
      expect(utils.monthToNumber('Ja')).toEqual(0) // two digits is enough if unambiguous
      expect(utils.monthToNumber('feb')).toEqual(1)
      expect(utils.monthToNumber('Aug')).toEqual(7)
      expect(utils.monthToNumber('september')).toEqual(8)
      expect(utils.monthToNumber('nov')).toEqual(10)
      expect(utils.monthToNumber('décembre')).toEqual(11)
    })

    it('throws an error for invalid input', () => {
      expect(() => utils.monthToNumber('foo')).toThrowError('Invalid month name: foo')
    })
  })

  describe('yearToFull', () => {
    describe('yearToFull', () => {
      it('converts a two-digit year to a four-digit year in the 20th century', () => {
        expect(utils.yearToFull(87)).toBe(1987)
      })

      it('converts a two-digit year to a four-digit year in the 21st century', () => {
        expect(utils.yearToFull(22)).toBe(2022)
      })

      it('returns a four-digit year unchanged', () => {
        expect(utils.yearToFull(2000)).toBe(2000)
      })

      it('returns a four-digit year unchanged if year is greater than 99', () => {
        expect(utils.yearToFull(2099)).toBe(2099)
      })

      it('handles string input with non-numeric characters', () => {
        expect(utils.yearToFull('a22')).toBe(2022)
      })

      it('handles string input with extra spaces', () => {
        expect(utils.yearToFull('  87  ')).toBe(1987)
      })

      it('handles years in the past as long as they are over three digits', () => {
        expect(utils.yearToFull('203')).toBe(203)
        expect(utils.yearToFull('1901')).toBe(1901)
      })
    })
  })

  describe('parseDate', function () {
    let today: Date
    let yesterday: Date
    let tomorrow: Date

    beforeEach(() => {
      today = new Date()
      yesterday = new Date()
      tomorrow = new Date()

      today.setHours(0)
      today.setMinutes(0)
      today.setSeconds(0)
      today.setMilliseconds(0)

      yesterday.setHours(0)
      yesterday.setMinutes(0)
      yesterday.setSeconds(0)
      yesterday.setMilliseconds(0)
      yesterday.setDate(today.getDate() - 1)

      tomorrow.setHours(0)
      tomorrow.setMinutes(0)
      tomorrow.setSeconds(0)
      tomorrow.setMilliseconds(0)
      tomorrow.setDate(today.getDate() + 1)
    })

    it('should return a date object', function () {
      expect(utils.parseDate('2019-01-01')).toEqual(new Date('2019-01-01 00:00:00'))
    })

    it('should return a date object with a time if only a time is set', function () {
      const today1300 = new Date()
      today1300.setHours(13)
      today1300.setMinutes(0)
      today1300.setSeconds(0)
      today1300.setMilliseconds(0)

      expect(utils.parseDate('13:00')).toEqual(today1300)
    })

    it('returns correct date', () => {
      expect(utils.parseDate('1/2/3')).toEqual(new Date('2003/01/02 00:00:00'))
      expect(utils.parseDate('2000-2-1')).toEqual(new Date('2000/02/01 00:00:00'))
      expect(utils.parseDate('Jan 5 2000')).toEqual(new Date('2000/01/05 00:00:00'))
      expect(utils.parseDate('5 Jan 99')).toEqual(new Date('1999/01/05 00:00:00'))

      // Numbers over 12 will either be date or year
      // m/d/y
      expect(utils.parseDate('3 30 05')).toEqual(new Date('2005/03/30 00:00:00'))

      // m/d/y
      expect(utils.parseDate('3 05 30')).toEqual(new Date('2030/03/05 00:00:00'))

      // Anything alphabetic should be interpreted as a month.
      // Also, if the month comes first, and remaining is ambiguous,
      // the second token should be interpreted as the day
      expect(utils.parseDate('jan/5/30')).toEqual(new Date('2030/01/05 00:00:00'))

      // If the month and year are unambiguous, the remaining token is the day
      // Unsupported weird formats
      expect(utils.parseDate('jan/2005/10')).toEqual(new Date('2005/01/10 00:00:00'))
      expect(utils.parseDate('30 2001 Jan')).toEqual(new Date('2001/01/30 00:00:00'))

      expect(utils.parseDate('Jan 5, 30')).toEqual(new Date('2030/01/05 00:00:00'))
      expect(utils.parseDate('Jan 30, 2001')).toEqual(new Date('2001/01/30 00:00:00'))
      expect(utils.parseDate('30 Jan 2001')).toEqual(new Date('2001/01/30 00:00:00'))

      // unsupported
      expect(utils.parseDate('010203')).toEqual(new Date('2001/02/03'))

      // 8-digit number is interpreted as YYYYMMDD
      expect(utils.parseDate('20010203')).toEqual(new Date('2001/02/03 00:00:00'))

      // Apostrophes are ignored
      expect(utils.parseDate("1 2 '02")).toEqual(new Date('2002/01/02 00:00:00'))
      // This will be interpreted as 2001-Feb-03
      expect(utils.parseDate("'01 2 03")).toEqual(new Date('2001/02/03 00:00:00'))
    })

    it('adds the current year if no year was given', () => {
      expect(utils.parseDate('02-03')).toEqual(new Date(today.getFullYear() + '/02/03'))
      expect(utils.parseDate('Jan-06')).toEqual(new Date(today.getFullYear() + '/01/06'))
      expect(utils.parseDate('12-30')).toEqual(new Date(today.getFullYear() + '/12/30'))
      expect(utils.parseDate('1 3')).toEqual(new Date(today.getFullYear() + '/1/3'))
    })

    it('ignores any weekdays', () => {
      expect(utils.parseDate('Saturday 30 Jan 2001')).toEqual(new Date('2001/01/30 00:00:00'))
      expect(utils.parseDate('30 Jan 2001 Mon')).toEqual(new Date('2001/01/30 00:00:00'))
    })

    // In apps-date this would be interpreted as 1999-02-01
    it('returns invalid date when passed date that does not exist', () => {
      expect(utils.parseDate('1999-02-29')).toEqual(new Date('1999/02/29 00:00:00'))
    })

    it("returns now as today's date", () => {
      expect(utils.parseDate('now')).toEqual(today)
      expect(utils.parseDate('today')).toEqual(today)
      // Only support English for now
      // expect(utils.parseDate('ahora')).toEqual(today)
      // expect(utils.parseDate("aujourd'hui")).toEqual(today)
    })

    // Removed support for yesterday
    // it('returns yesterday as yesterday\'s date', () => {
    //   expect(utils.parseDate('yesterday')).toEqual(yesterday)
    //   expect(utils.parseDate('ayer')).toEqual(yesterday)
    //   expect(utils.parseDate('hier')).toEqual(yesterday)
    // })

    it("returns 'tomorrow' as tomorrow's date", () => {
      expect(utils.parseDate('tomorrow')).toEqual(tomorrow)
      // expect(utils.parseDate('manana')).toEqual(tomorrow)
      // expect(utils.parseDate('demain')).toEqual(tomorrow)
    })

    it('returns correct time when a time is passed', () => {
      expect(utils.parseDate('2001-04-20 4:00p')).toEqual(new Date(2001, 3, 20, 16, 0, 0, 0))
      //   // expect(utils.parseDate('manana')).toEqual(tomorrow)
      //   // expect(utils.parseDate('demain')).toEqual(tomorrow)
    })
  })

  describe('guessDatePart', () => {
    it('should return empty array if token cannot be valid month, day, or year', () => {
      expect(utils.guessDatePart(-1)).toEqual([])
    })
  })

  describe('guessDateParts', () => {
    it('should return a valid date object given a valid date string', () => {
      const str = '25 12 2022'
      const result: DateParts = { day: 25, month: 12, year: 2022 }
      expect(utils.guessDateParts(str)).toEqual(result)
    })

    it('throws an error if the date is invalid', () => {
      expect(() => utils.guessDateParts('1234')).toThrow('Invalid Date')
    })

    it('throws an error for invalid date strings', () => {
      const invalidDateString = '*&bcd efgh'
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

      expect(() => utils.guessDateParts(invalidDateString)).toThrowError('Invalid Date')
      expect(consoleError).toHaveBeenCalledWith(`not date because *&bcd isNaN`)
      consoleError.mockRestore()
    })

    it('should correctly assign year if meanings includes y', () => {
      const dateString = '1 2 3'
      const date = utils.guessDateParts(dateString)
      expect(date.year).toBe(2003)
    })

    // it('should return an error given an invalid date string', () => {
    //   const str = '31 22 2022'
    //   expect(() => utils.guessDateParts(str)).toThrowError('Invalid Date')
    // })

    // it('should return a valid date object given a two-token date string', () => {
    //   const str = '12 2022'
    //   const result: DateParts = { day: new Date().getDate(), month: 12, year: 2022 }
    //   expect(utils.guessDateParts(str)).toEqual(result)
    // })

    // it('should return a valid date object given a one-token date string', () => {
    //   const str = '2022'
    //   const result: DateParts = {
    //     day: new Date().getDate(),
    //     month: new Date().getMonth() + 1,
    //     year: 2022,
    //   }
    //   expect(utils.guessDateParts(str)).toEqual(result)
    // })
  })

  describe('parseTime', () => {
    it('should return the current time if "now" is passed', () => {
      const now = new Date()
      const result = utils.parseTime('now')
      expect(result).toMatchObject({
        hour: now.getHours(),
        minute: now.getMinutes(),
        second: now.getSeconds(),
      })
    })

    it('should return 12:00 PM if "noon" is passed', () => {
      const result = utils.parseTime('noon')
      expect(result).toMatchObject({ hour: 12, minute: 0, second: 0 })
    })

    it('should return a time if a 3 or 4 digit number is passed', () => {
      expect(utils.parseTime('123')).toMatchObject({ hour: 1, minute: 23, second: 0 })

      expect(utils.parseTime('1234')).toMatchObject({ hour: 12, minute: 34, second: 0 })
    })

    it('should return null if a non-time string is passed', () => {
      expect(utils.parseTime('abc as')).toBeNull()
      expect(utils.parseTime('abc')).toBeNull()
      expect(utils.parseTime('')).toBeNull()
    })

    it('should return an object with hour, minute, and second properties', () => {
      const time = '12:34:56'
      const result = utils.parseTime(time)
      expect(result).toMatchObject({ hour: 12, minute: 34, second: 56 })
    })

    it('should handle leading zeros', () => {
      const time = '01:02:03'
      const result = utils.parseTime(time)
      expect(result).toMatchObject({ hour: 1, minute: 2, second: 3 })
    })

    it('should handle times with only hours and minutes', () => {
      const time = '12:34'
      const result = utils.parseTime(time)
      expect(result).toMatchObject({ hour: 12, minute: 34, second: 0 })
    })

    it('should handle times with only hours', () => {
      const time = '12'
      const result = utils.parseTime(time)
      expect(result).toMatchObject({ hour: 12, minute: 0, second: 0 })
    })

    it('should handle 24h time', () => {
      const time = '23:59:59'
      const result = utils.parseTime(time)
      expect(result).toMatchObject({ hour: 23, minute: 59, second: 59 })
    })

    it('should handle 12h times with meridiem', () => {
      const time = '12a'
      const result = utils.parseTime(time)
      expect(result).toMatchObject({ hour: 0, minute: 0, second: 0 })
    })

    it('should handle 12h times with meridiem', () => {
      const time = '1p'
      const result = utils.parseTime(time)
      expect(result).toMatchObject({ hour: 13, minute: 0, second: 0 })
    })

    it('should handle 12h times with uppercase meridiem', () => {
      const time = '1P'
      const result = utils.parseTime(time)
      expect(result).toMatchObject({ hour: 13, minute: 0, second: 0 })
    })

    it('should handle 12h times with meridiem', () => {
      const time = '2 p'
      const result = utils.parseTime(time)
      expect(result).toMatchObject({ hour: 14, minute: 0, second: 0 })
    })

    it('should handle 12h times with meridiem', () => {
      const time = '2 p.m.'
      const result = utils.parseTime(time)
      expect(result).toMatchObject({ hour: 14, minute: 0, second: 0 })
    })

    it('should handle 12h times with meridiem', () => {
      const time = '2 pm'
      const result = utils.parseTime(time)
      expect(result).toMatchObject({ hour: 14, minute: 0, second: 0 })
    })

    it('should handle 12h times with meridiem', () => {
      const time = '2:31 p'
      const result = utils.parseTime(time)
      expect(result).toMatchObject({ hour: 14, minute: 31, second: 0 })
    })

    it('should handle 12h times with meridiem', () => {
      const time = '11:31:29 p'
      const result = utils.parseTime(time)
      expect(result).toMatchObject({ hour: 23, minute: 31, second: 29 })
    })

    it('should handle invalid input', () => {
      const time = 'abc'
      const result = utils.parseTime(time)
      expect(result).toBe(null)
    })
  }) // end parseTime

  describe('parseTimeToString', () => {
    it('should return a formatted string for a valid time', () => {
      const value = '12:34:56'
      const result = utils.parseTimeToString(value)
      expect(result).toEqual('12:34 PM')
    })

    it('should handle leading zeros', () => {
      const value = '01:02:03'
      const result = utils.parseTimeToString(value)
      expect(result).toEqual('1:02 AM')
    })

    it('should handle times with only hours and minutes', () => {
      const value = '12:34'
      const result = utils.parseTimeToString(value)
      expect(result).toEqual('12:34 PM')
    })

    it('should handle times with only hours', () => {
      const value = '12'
      const result = utils.parseTimeToString(value)
      expect(result).toEqual('12:00 PM')
    })

    it('should handle military time', () => {
      const value = '23:59:59'
      const result = utils.parseTimeToString(value)
      expect(result).toEqual('11:59 PM')
    })

    it('should handle invalid input', () => {
      const value = 'abc'
      const result = utils.parseTimeToString(value)
      expect(result).toBe('')
    })

    it('should handle custom format', () => {
      const value = '12:34:56'
      const format = 'hh:mm:ss'
      const result = utils.parseTimeToString(value, format)
      expect(result).toEqual('12:34:56')
    })

    it('should handle HH:mm:ss format', () => {
      const value = '14:34:56'
      const format = 'HH:mm:ss'
      const result = utils.parseTimeToString(value, format)
      expect(result).toEqual('14:34:56')
    })
  }) // end parseTimeToString

  describe('parseDateTime', () => {
    it('should correctly parse valid date and time strings', () => {
      // Example of standard date-time format
      expect(utils.parseDateTime('January 1, 2021 14:30')).toEqual(new Date(2021, 0, 1, 14, 30))
      // Example including meridiem
      expect(utils.parseDateTime('February 15, 2020 1:45 pm')).toEqual(
        new Date(2020, 1, 15, 13, 45)
      )
      // Example with different ordering
      expect(utils.parseDateTime('20:00, July 4, 2022')).toEqual(new Date(2022, 6, 4, 20, 0))
    })

    it('should return null for invalid date-time strings', () => {
      expect(utils.parseDateTime('Invalid Date String')).toBeNull()
      expect(utils.parseDateTime('32 January 2021')).toBeNull()
      expect(utils.parseDateTime('')).toBeNull()
    })

    it('should handle edge cases', () => {
      // Handling date without time
      expect(utils.parseDateTime('March 10, 2021')).toEqual(new Date(2021, 2, 10))
      // Handling time without date
      expect(utils.parseDateTime('23:59')).toEqual(new Date(new Date().setHours(23, 59, 0, 0)))
      expect(utils.parseDateTime('11:07 PM')).toEqual(new Date(new Date().setHours(23, 7, 0, 0)))
      // Handling different delimiters
      expect(utils.parseDateTime('2021/12/31 11:01 PM')).toEqual(new Date(2021, 11, 31, 23, 1))
    })

    it('should be robust against various formats', () => {
      // Testing different formats and separators
      expect(utils.parseDateTime('2021.03.25 18:30')).toEqual(new Date(2021, 2, 25, 18, 30))
      expect(utils.parseDateTime('04-07-2022 7:00pm')).toEqual(new Date(2022, 3, 7, 19, 0))
      expect(utils.parseDateTime('1 July 2021, 11:59 PM')).toEqual(new Date(2021, 6, 1, 23, 59))
      expect(utils.parseDateTime('July 2 2022, 1:5 P')).toEqual(new Date(2022, 6, 2, 13, 5))
      expect(utils.parseDateTime('July 2 2022, 1:05 P')).toEqual(new Date(2022, 6, 2, 13, 5))
      expect(utils.parseDateTime('July 2 2022, 1:05 A')).toEqual(new Date(2022, 6, 2, 1, 5))
      expect(utils.parseDateTime('July 2 2022, 1:5')).toEqual(new Date(2022, 6, 2, 1, 5))
      expect(utils.parseDateTime('2023-Dec-31 5:00 P')).toEqual(new Date(2023, 11, 31, 17, 0))
      expect(utils.parseDateTime('2023-Dec-31 5:0P')).toEqual(new Date(2023, 11, 31, 17, 0))
    })

    it('should handle 1-2 digit hour with meridiem', () => {
      expect(utils.parseDateTime('2023-09-25 1P')).toEqual(new Date(2023, 8, 25, 13, 0))
      expect(utils.parseDateTime('2023.09.25 10A')).toEqual(new Date(2023, 8, 25, 10, 0))
      expect(utils.parseDateTime('2023-09-25 10 AM')).toEqual(new Date(2023, 8, 25, 10, 0))
      expect(utils.parseDateTime('20230925 1200AM')).toEqual(new Date(2023, 8, 25, 0, 0))
    })

    it('should handle different separators and no separator between date and time', () => {
      expect(utils.parseDateTime('2023/09/25 1P')).toEqual(new Date(2023, 8, 25, 13, 0))
      expect(utils.parseDateTime('2023-09-25T10A')).toEqual(new Date(2023, 8, 25, 10, 0))
      expect(utils.parseDateTime('20230925 10 AM')).toEqual(new Date(2023, 8, 25, 10, 0))
      expect(utils.parseDateTime('2023.09.25 1200AM')).toEqual(new Date(2023, 8, 25, 0, 0))
    })

    it('should handle 2-4 digit times with no meridiem and no colon if the year is first', () => {
      expect(utils.parseDateTime('2023-09-25 1200')).toEqual(new Date(2023, 8, 25, 12, 0))
      expect(utils.parseDateTime('20230925 100')).toEqual(new Date(2023, 8, 25, 1, 0))
      expect(utils.parseDateTime('20230925 13')).toEqual(new Date(2023, 8, 25, 13, 0))
      expect(utils.parseDateTime('2023 September 25 13')).toEqual(new Date(2023, 8, 25, 13, 0))
    })

    it('should handle conventional dates and times if the time is first', () => {
      expect(utils.parseDateTime('12:00AM 2023-09-25')).toEqual(new Date(2023, 8, 25, 0, 0))
      expect(utils.parseDateTime('13:00 2023-09-25')).toEqual(new Date(2023, 8, 25, 13, 0))
      expect(utils.parseDateTime('1PM 2023-09-25')).toEqual(new Date(2023, 8, 25, 13, 0))
      expect(utils.parseDateTime('1P 2023-09-25')).toEqual(new Date(2023, 8, 25, 13, 0))
      expect(utils.parseDateTime('12:45 20230925')).toEqual(new Date(2023, 8, 25, 12, 45))
    })

    // Test formats without meridiem (24-hour clock)
    it('should handle 24-hour clock formats without meridiem', () => {
      expect(utils.parseDateTime('2023-09-25 13:00')).toEqual(new Date(2023, 8, 25, 13, 0))
      expect(utils.parseDateTime('2023.09.25 23:59')).toEqual(new Date(2023, 8, 25, 23, 59))
      expect(utils.parseDateTime('2023-09-25 00:00')).toEqual(new Date(2023, 8, 25, 0, 0))
      expect(utils.parseDateTime('20230925 23:59:59')).toEqual(new Date(2023, 8, 25, 23, 59, 59))
    })

    // Test different meridiem formats
    it('should handle different meridiem formats', () => {
      expect(utils.parseDateTime('2023-09-25 1p.m.')).toEqual(new Date(2023, 8, 25, 13, 0))
      expect(utils.parseDateTime('2023.09.25 10a.m.')).toEqual(new Date(2023, 8, 25, 10, 0))
      expect(utils.parseDateTime('2023-09-25 11 P.M.')).toEqual(new Date(2023, 8, 25, 23, 0))
      expect(utils.parseDateTime('20230925 12 a.m.')).toEqual(new Date(2023, 8, 25, 0, 0))
    })

    it('should handle some shorthand formats', () => {
      expect(utils.parseDateTime('Sep 25 1p')).toEqual(
        new Date(new Date().getFullYear(), 8, 25, 13, 0)
      )

      expect(utils.parseDateTime('2022 Sep 25 1p')).toEqual(new Date(2022, 8, 25, 13, 0))
    })

    it('should handle date without a time', () => {
      expect(utils.parseDateTime('2023-09-25')).toEqual(new Date(2023, 8, 25))
      expect(utils.parseDateTime('September 25, 2023')).toEqual(new Date(2023, 8, 25))
      expect(utils.parseDateTime('20230925')).toEqual(new Date(2023, 8, 25))
    })

    it('should handle time without a date', () => {
      expect(utils.parseDateTime('23:59')).toEqual(new Date(new Date().setHours(23, 59, 0, 0)))
      expect(utils.parseDateTime('11:07 PM')).toEqual(new Date(new Date().setHours(23, 7, 0, 0)))
    })

    it('should handle "today" and "tomorrow" with a time', () => {
      expect(utils.parseDateTime('today 11:07 PM')).toEqual(
        new Date(new Date().setHours(23, 7, 0, 0))
      )

      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      expect(utils.parseDateTime('tomorrow 11:07 PM')).toEqual(
        new Date(tomorrow.setHours(23, 7, 0, 0))
      )
    })

    it('should handle "now" as the current date and time, rounded to seconds', () => {
      // We don't care about milliseconds so zero them out
      const now = new Date().setMilliseconds(0)
      expect(utils.parseDateTime('now')).toEqual(new Date(now))
    })

    it('should handle "noon" as 12:00 PM', () => {
      expect(utils.parseDateTime('noon')).toEqual(new Date(new Date().setHours(12, 0, 0, 0)))
    })
  })

  describe('formatDateTime', () => {
    it('should return a formatted string for a given date and format', () => {
      const date = new Date(2022, 0, 1, 12, 34, 56)
      const format = 'YYYY-MM-DD HH:mm:ss'
      const result = utils.formatDateTime(date, format)
      expect(result).toEqual('2022-01-01 12:34:56')
    })

    it('should handle custom format with day of week and full month', () => {
      // Hmm, I don't support ordinal dates yet
      const date = new Date(2022, 0, 1, 12, 34, 56)
      const format = 'dddd, MMMM D YYYY, h:mm:ss a'
      const result = utils.formatDateTime(date, format)
      expect(result).toEqual('Saturday, January 1 2022, 12:34:56 pm')
    })

    // TODO: No timezone support yet
    // it('should handle format with timezone', () => {
    //   const date = new Date(2022, 0, 1, 12, 34, 56)
    //   const format = 'YYYY-MM-DD HH:mm:ss ZZ'
    //   const result = utils.formatDateTime(date, format)
    //   expect(result).toEqual('2022-01-01 12:34:56 +00:00')
    // })

    it('should handle format with only time', () => {
      const date = new Date(2022, 0, 1, 12, 34, 56)
      const format = 'HH:mm:ss'
      const result = utils.formatDateTime(date, format)
      expect(result).toEqual('12:34:56')
    })

    it('should handle format with only date', () => {
      const date = new Date(2022, 0, 1, 12, 34, 56)
      const format = 'YYYY-MM-DD'
      const result = utils.formatDateTime(date, format)
      expect(result).toEqual('2022-01-01')
    })

    it('should handle format with only time', () => {
      const date = new Date(2022, 0, 1, 12, 34, 56)
      const format = 'HH:mm:ss'
      const result = utils.formatDateTime(date, format)
      expect(result).toEqual('12:34:56')
    })
  }) // end formatDateTime

  describe('parseDateToString', () => {
    it('should return a formatted string for a valid date', () => {
      const value = '2022-01-31'
      const result = utils.parseDateToString(value)
      expect(result).toEqual('2022-Jan-31')
    })

    it('should handle invalid input', () => {
      const value = 'abc'
      const result = utils.parseDateToString(value)
      expect(result).toBe('')
    })

    it('should handle custom format', () => {
      const value = '2022-01-01'
      const format = 'YYYY/MM-DD'
      const result = utils.parseDateToString(value, format)
      expect(result).toEqual('2022/01-01')
    })

    it('should handle date input', () => {
      const value = new Date(2022, 0, 1)
      const result = utils.parseDateToString(value)
      expect(result).toEqual('2022-Jan-01')
    })
  })

  describe('parseDateTimeToString', () => {
    it('should return a formatted string for a valid date and time', () => {
      const value = '2022-01-31 2:01 P'
      const result = utils.parseDateTimeToString(value)
      expect(result).toEqual('2022-Jan-31 2:01 PM')
    })

    it('should handle invalid input', () => {
      const value = 'abc'
      const result = utils.parseDateTimeToString(value)
      expect(result).toBe('')
    })

    it('should handle custom format', () => {
      const value = '2022-01-01 01:02'
      const format = 'YYYY/MM-DD HH:mm:ss'
      const result = utils.parseDateTimeToString(value, format)
      expect(result).toEqual('2022/01-01 01:02:00')
    })

    it('should handle custom format', () => {
      const value = '2022-01-01 13:02'
      const format = 'YYYY/MM-DD h:mm a'
      const result = utils.parseDateTimeToString(value, format)
      expect(result).toEqual('2022/01-01 1:02 pm')
    })

    it('should handle date input', () => {
      const value = new Date(2022, 0, 1)
      const result = utils.parseDateTimeToString(value)
      expect(result).toEqual('2022-Jan-01 12:00 AM')
    })

    it('should handle date input', () => {
      const value = '2024-01-01 20:01'
      const format = 'YYYY-MMM-DD h:mm A'
      const result = utils.parseDateTimeToString(value, format)
      expect(result).toEqual('2024-Jan-01 8:01 PM')
    })

    it('should handle date input', () => {
      const value = '2024-01-01 8:1 P'
      const format = 'YYYY-MMM-DD h:mm A'
      const result = utils.parseDateTimeToString(value, format)
      expect(result).toEqual('2024-Jan-01 8:01 PM')
    })
  })

  describe('isDate', () => {
    it('should return true if the value is a valid date string', () => {
      expect(utils.isDate('2022-01-01')).toBe(true)
    })

    it('should return true if the value is a valid Date object', () => {
      expect(utils.isDate(new Date('2022-01-01'))).toBe(true)
    })

    it('should return false if the value is an invalid date string', () => {
      expect(utils.isDate('invalid date')).toBe(false)
    })

    it('should return false if the value is an invalid Date object', () => {
      vi.spyOn(Date, 'parse').mockImplementationOnce(() => NaN)
      expect(utils.isDate(new Date('invalid date'))).toBe(false)
    })

    it('should return false if the value is not a date string or Date object', () => {
      // @ts-ignore
      expect(utils.isDate(123)).toBe(false)
    })
  })

  describe('isDateTime', () => {
    it('should return true if the value is a valid date and time string', () => {
      expect(utils.isDateTime('2022-01-01 1:00 PM')).toBe(true)
    })

    it('should return true if the value is a valid date string', () => {
      expect(utils.isDateTime('2022-01-30')).toBe(true)
    })

    it('should return true if the value is a valid Date object', () => {
      expect(utils.isDateTime(new Date('2022-01-01'))).toBe(true)
    })

    it('should return true if valid time string', () => {
      expect(utils.isDateTime('2:00 AM')).toBe(true)
    })

    it('should return false if the value is not a sensible date or time', () => {
      expect(utils.isDateTime('12')).toBe(false)
      expect(utils.isDateTime('123')).toBe(false)
    })

    it('should return false if the value is an invalid Date object', () => {
      vi.spyOn(Date, 'parse').mockImplementationOnce(() => NaN)
      expect(utils.isDateTime(new Date('invalid date'))).toBe(false)
    })

    it('should return false if the value is not a date string or Date object', () => {
      // @ts-ignore
      expect(utils.isDateTime(123)).toBe(false)
    })
  })

  describe('isDateInRange', () => {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)
    const yesterday = new Date(today)
    yesterday.setDate(today.getDate() - 1)

    it('should return true if date is in range', function () {
      expect(utils.isDateInRange(today, 'future')).toBe(true)
      expect(utils.isDateInRange(yesterday, 'future')).toBe(false)
      expect(utils.isDateInRange(tomorrow, 'future')).toBe(true)
      expect(utils.isDateInRange(today, 'past')).toBe(true)
      expect(utils.isDateInRange(yesterday, 'past')).toBe(true)
      expect(utils.isDateInRange(tomorrow, 'past')).toBe(false)
    })
  }) // end isDateInRange

  describe('isMeridiem', () => {
    it('should return true if the value is a valid meridiem string', () => {
      expect(utils.isMeridiem('AM')).toBe(true)
      expect(utils.isMeridiem('PM')).toBe(true)
      expect(utils.isMeridiem('am')).toBe(true)
      expect(utils.isMeridiem('pm')).toBe(true)
      expect(utils.isMeridiem('A.M.')).toBe(true)
      expect(utils.isMeridiem('p.m.')).toBe(true)
      expect(utils.isMeridiem('p. m.')).toBe(true)
      expect(utils.isMeridiem('a')).toBe(true)
      expect(utils.isMeridiem('p')).toBe(true)
      expect(utils.isMeridiem('A')).toBe(true)
      expect(utils.isMeridiem('P')).toBe(true)
    })

    it('should return false if the value is not a valid meridiem string', () => {
      expect(utils.isMeridiem('abc')).toBe(false)
      expect(utils.isMeridiem('AMPM')).toBe(false)
      expect(utils.isMeridiem('')).toBe(false)
      expect(utils.isMeridiem(' ')).toBe(false)
    })
  }) // end isMeridiem

  describe('isTime', () => {
    it('should return true for valid time strings', () => {
      expect(utils.isTime('10:30:15')).toBe(true)
      expect(utils.isTime('1:30 PM')).toBe(true)
      expect(utils.isTime('23:59:59')).toBe(true)
      expect(utils.isTime('12:00 AM')).toBe(true)
      expect(utils.isTime('1p')).toBe(true)
    })

    it('should return false for invalid time strings', () => {
      expect(utils.isTime('abc')).toBe(false)
      expect(utils.isTime('')).toBe(false)
      expect(utils.isTime(' : ')).toBe(false)
    })
  })

  describe('isEmail', function () {
    const emailAddresses = [
      'email@example.com',
      'email+tag@example.com',
      'email.dot@example.com',
      'email@sub.example.com',
      '"email"@example.com',
      '"email@example.com"@example.com',
      'correo@ejemplo.es',
      'user@xn--ls8h.com',
      'user@example.com',
      'user.name@sub.example.com',
      'user_name@example.com',
      // '邮箱@例子.中国',
      // 'почта@пример.рф',
      // '電子郵件@範例.香港',
      // '이메일@예시.한국',
      // '電子メール@サンプル.日本',
      'a.valid.email.that.is.very.very.long.and.should.validate.because.it.is.under.two.hundred.and.fifty.five.characters.with.lots.of.subdomains.in.it.that.is.quite.ridiculous@a.very.long.top.level.domain.that.is.also.very.long.and.has.lots.of.letters.in.it.com',
    ]

    const invalidEmailAddresses = [
      'john.doe@',
      'john.doe@.com',
      'john.doe@com.',
      'john.doe@-example.com',
      'john.doe@example-.com',
      'john.doe@example.com-',
      'john.doe@example.com/',
      'john.doe@example..com',
      'john.doe@ex@mple.com',
      'john.doe@example.com?',
      'user@invalid.c',
      'an.email.that.is.a.little.too.long.and.should.not.validate.because.it.is.over.two.hundred.and.fifty.five.characters.with.lots.of.subdomains.in.it.that.is.quite.ridiculous@a.very.long.top.level.domain.that.is.also.very.long.and.has.lots.of.letters.in.it.com',
      'userexample.com',
      'user@',
      '@example.com',
      'user@example@example.com',
      'user@invalid.c',
      'user@example.com!',
      'user@!example.com',
      '',
    ]

    emailAddresses.forEach((email) => {
      it(`should return true for valid email address: ${email}`, function () {
        expect(utils.isEmail(email)).toBe(true)
      })
    })

    invalidEmailAddresses.forEach((email) => {
      it(`should return false for invalid email address: ${email}`, function () {
        expect(utils.isEmail(email)).toBe(false)
      })
    })
  }) // end isEmail

  describe('parseNANPTel', function () {
    const validNumbers = [
      '555-555-5555',
      '(555)555-5555',
      '555_555_5555',
      '555 555 5555',
      '555.555.5555',
      '+1 555 555 5555',
    ]

    const invalidNumbers = [
      '555 555',
      '555-555-5555x123',
      '555-555-555',
      '555-555-55555',
      '555-555-5555x',
      '555-555-5555 ext. 123',
    ]

    validNumbers.forEach((telephoneNumber) => {
      it(`should return true for valid North American phone number: ${telephoneNumber}`, function () {
        expect(utils.parseNANPTel(telephoneNumber)).toEqual('555-555-5555')
      })
    })

    it('removes leading one', function () {
      const validNumbers = ['223-123-1234', '1 223-123-1234', '1223-123-1234']
      validNumbers.forEach((value) => expect(utils.parseNANPTel(value)).toEqual('223-123-1234'))
    })

    invalidNumbers.forEach((telephoneNumber) => {
      it(`should not modify invalid phone number string: ${telephoneNumber}`, function () {
        expect(utils.parseNANPTel(telephoneNumber)).toBe(telephoneNumber)
      })
    })
  })

  describe('isNANPTel', function () {
    const invalidNumbers = [
      '1-780-555-1234',
      '(780) 555-1234',
      '555 555',
      '555-555-5555x123',
      '555-555-555',
      '555-555-55555',
      '555-555-5555x',
      '555-555-5555 ext. 123',
    ]

    it('should return true for phone numbers in xxx-xxx-xxxx format', function () {
      const validNumbers = ['555-555-5555']
      validNumbers.forEach((value) => expect(utils.isNANPTel(value)).toEqual(true))
    })

    it('should return false for other formats', function () {
      invalidNumbers.forEach((value) => expect(utils.isNANPTel(value)).toEqual(false))
    })
  }) // end isNANPTel

  describe('parseInteger', () => {
    it('should remove all non-digit characters', () => {
      expect(utils.parseInteger('123abc')).toBe('123')
      expect(utils.parseInteger('abc123')).toBe('123')
      expect(utils.parseInteger('123 456')).toBe('123456')
    })
  })

  describe('isNumber', () => {
    it('should return true for valid numbers', () => {
      expect(utils.isNumber('123')).toBe(true)
      expect(utils.isNumber('-123')).toBe(true)
      expect(utils.isNumber('123.456')).toBe(true)
      expect(utils.isNumber('-123.456')).toBe(true)
    })

    it('should return false for invalid numbers', () => {
      expect(utils.isNumber('abc')).toBe(false)
      expect(utils.isNumber('123abc')).toBe(false)
      expect(utils.isNumber('abc123')).toBe(false)
      expect(utils.isNumber('.12.3')).toBe(false)
    })
  })

  describe('parseNumber', () => {
    it('should remove all non-digit, non-hyphen, and non-period characters', () => {
      expect(utils.parseNumber('abc123')).toBe('123')
      expect(utils.parseNumber('-123.456abc')).toBe('-123.456')
    })

    it('should keep only the first hyphen', () => {
      expect(utils.parseNumber('--123')).toBe('-123')
      expect(utils.parseNumber('123--')).toBe('123')
    })

    it('should keep only the first period', () => {
      expect(utils.parseNumber('123..456')).toBe('123.456')
      expect(utils.parseNumber('..123456')).toBe('.123456')
    })
  })

  describe('isInteger', () => {
    it('should return true for valid integers', () => {
      expect(utils.isInteger('123')).toBe(true)
      expect(utils.isInteger('-123')).toBe(true)
    })

    it('should return false for invalid integers', () => {
      expect(utils.isInteger('abc')).toBe(false)
      expect(utils.isInteger('123abc')).toBe(false)
      expect(utils.isInteger('abc123')).toBe(false)
      expect(utils.isInteger('123.456')).toBe(false)
    })
  })

  describe('parseUrl', () => {
    it('should return the original string if it is already a valid URL', () => {
      expect(utils.parseUrl('https://example.com')).toBe('https://example.com')
      expect(utils.parseUrl('http://example.com')).toBe('http://example.com')
      expect(utils.parseUrl('//example.com')).toBe('//example.com')
    })

    it('should return the string with https:// prepended if it is not a valid URL', () => {
      expect(utils.parseUrl('example.com')).toBe('https://example.com')
      expect(utils.parseUrl(' example.com ')).toBe('https://example.com')
    })
  })

  describe('isUrl', () => {
    it('should return true for valid URLs', () => {
      expect(utils.isUrl('https://example.com')).toBe(true)
      expect(utils.isUrl('http://example.com')).toBe(true)
      expect(utils.isUrl('//example.com')).toBe(true)
    })

    it('should return false for invalid URLs', () => {
      expect(utils.isUrl('example.com')).toBe(false)
      expect(utils.isUrl(' example.com ')).toBe(false)
    })
  })

  describe('parseZip', function () {
    const validZipCodes = ['12345', '12345-1234', '12345 1234', '12345_1234', '12345-']
    const expectedCodes = ['12345', '12345-1234', '12345-1234', '12345-1234', '12345']

    validZipCodes.forEach((value, index) => {
      it(`should return sanitized US zip code for valid input: ${value}`, function () {
        expect(utils.parseZip(value)).toEqual(expectedCodes[index])
      })
    })
  }) // end parseZip

  describe('isZip', function () {
    const validZipCodes = ['12345', '12345-1234', '99501-1234']
    const invalidZipCodes = [
      '1234', // too short
      '123456', // too long
      '12345-123', // too short
      '12345-12345', // too long
      '12345-1234-1234', // too long
    ]

    validZipCodes.forEach((value) => {
      it(`should return true for valid US zip code: ${value}`, function () {
        expect(utils.isZip(value)).toEqual(true)
      })
    })

    invalidZipCodes.forEach((value) => {
      it(`should return false for invalid US zip code: ${value}`, function () {
        expect(utils.isZip(value)).toEqual(false)
      })
    })
  }) // end isZip

  describe('parsePostalCA', function () {
    it('should return sanitized Canadian postal code for valid inputs', function () {
      const validPostalCodes = ['A1A 1A1', 'a1a1a1', 'A1A-1A1', 'A1a1A1']
      const expectedCodes = ['A1A 1A1', 'A1A 1A1', 'A1A 1A1', 'A1A 1A1']
      validPostalCodes.forEach((value, index) =>
        expect(utils.parsePostalCA(value)).toEqual(expectedCodes[index])
      )
    })
  })

  describe('isPostalCA', function () {
    it('should return true for valid Canadian postal codes', function () {
      const validPostalCodes = [
        'A1A 1A1',
        'B2B 2B2',
        'C3C 3C3',
        'T5X 1C3',
        'V9Z 9Z9',
        'X0X 0X0',
        'Y1Y 1Y1',
        'T6H 4T9',
      ]
      validPostalCodes.forEach((value) => expect(utils.isPostalCA(value)).toEqual(true))
    })

    it('should return false for invalid Canadian postal codes', function () {
      const invalidPostalCodes = [
        '1A1A1A',
        'T5X 13C',
        'A1A1A',
        'A1A1A1A',
        'A1A1A1A1',
        'a1a1a1a1',
        'D5A 1P9',
        'splat',
        'A1U 1A1',
        'Z9Z 9Z9',
      ]
      invalidPostalCodes.forEach((value) => expect(utils.isPostalCA(value)).toEqual(false))
    })
  })

  describe('isColor', () => {
    const validHexColors = [
      '#000000',
      '#00000000',
      '#123456',
      '#12345678',
      '#abcdef',
      '#abcdef01',
      '#ABC',
      '#ABC0',
      '#AbCdEf',
      '#AbCdEf01',
    ]

    const invalidHexColors = [
      '#0000000', // 7 digits
      '#000000000', // 9 digits
      '#12345', // 5 digits
      '#1234567', // 7 digits
      'abcdef', // 6 digits, no hash
      '#ab', // 2 digits
    ]

    const validRgbColors = [
      'rgb(0, 0, 0)',
      'rgb(0, 0, 0, 0)',
      'rgb(255, 255, 255)',
      'rgb(255, 255, 255, 1)',
      'rgb(255, 255, 255, 0.5)',
      'rgb(255, 255, 255, 0.123456)',
      'rgb(255, 255, 255, 0.123456789)',
      'rgb(255, 255, 255, 100%)',
      'rgba(255, 255, 255, 50%)',
      'rgba(255, 255, 255, 12.3456%)',
      'rgba(255,255,255)',
      'rgba(255,255,255,1)',
      'rgb(100%, 40%, 0%)', // percentages
      'rgb(20 30 40)', // spaces
      'rgb(20 30 40 / 0.5)', // spaces and alpha
    ]

    const invalidRgbColors = [
      'rgb(0, 0, 0, 0, 0)', // 5 values
      'rgb(0, 0, 0,)', // no final value
      'rgba(0, 0 0)', // only two values
    ]

    const validHslColors = [
      'hsl(0, 0%, 0%)',
      'hsl(0, 0%, 0%, 0)',
      'hsl(0, 0%, 0%, 0.5)',
      'hsl(100deg, 0%, 0%, 0.123456)',
      'hsl(100deg, 0%, 0%, 12%)',
      'hsla(100deg, 0%, 0%, 12%)',
      'hsl(100deg 0% 0%)', // spaces
      'hsl(100deg 0% 0% / 12.3456%)', // spaces and alpha
      'hsl(100deg 0% 0%/12%)', // spaces and alpha
      'hsl(100, 0%, 0%)',
      'hsl(360deg, 100%, 100%)',
      'hsl(180deg, 50%, 50%)',
      'hsla(180deg, 50%, 50%, 1)',
      'hsla(180deg, 50%, 50%, 0.5)',
      'hsl(180deg, 0%, 100%)',
      'hsla(180deg, 0%, 100%, 0.75)',
      'hsl(0, 0%, 100%)',
      'hsla(0, 0%, 100%, 0.25)',
    ]

    const invalidHslColors = [
      'hsl(0, 0%, 0%, 0, 0)', // 5 values
      'hsl(0, 0%, 0%,)', // no final value
      'hsla(0, 0 0)', // only two values
      'hsl(0, 0%,)', // no final value
      'hsl(0, 0%)', // only two values
      'hsl(0, 0%, 0, 0%)', // 4 values
      'hsl(-100, 0%, 0%)', // negative hue value
      'hsl(0, -100%, 0%)', // negative saturation value
      'hsl(0, 0%, -100%)', // negative lightness value
      'hsl120, 100%, 50%)',
      'asdf',
      // For more thorough testing, add these tests
      // 'hsl(500, 0%, 0%)', // hue value greater than 359
      // 'hsl(0, 200%, 0%)', // saturation value greater than 100
      // 'hsl(0, 0%, 200%)', // lightness value greater than 100
    ]

    const validColorNames = [
      'transparent',
      'currentColor',
      'black',
      'white',
      'red',
      'green',
      'blue',
      'yellow',
      'orange',
      'purple',
      'brown',
      'pink',
      'gray',
      'grey',
      'lavenderblush',
      'honeydew',
      'seashell',
      'azure',
      'lavender',
      'aliceblue',
      'ghostwhite',
      'mintcream',
      'oldlace',
      'linen',
      'cornsilk',
      'papayawhip',
      'beige',
      'bisque',
      'blanchedalmond',
      'wheat',
      'navajowhite',
      'peachpuff',
      'moccasin',
      'gainsboro',
      'lightgrey',
      'lightgray',
      'silver',
      'darkgray',
      'gray',
      'dimgray',
    ]

    const invalidColorNames = ['transparant', 'blak', 'whit', 'redish', 'greenish', 'blueish']

    validHexColors.forEach((color) => {
      it(`should validate ${color} as a valid hex color`, () => {
        expect(utils.isColor(color)).toBeTruthy()
      })
    })

    invalidHexColors.forEach((color) => {
      it(`should validate ${color} as an invalid hex color`, () => {
        expect(utils.isColor(color)).toBeFalsy()
      })
    })

    validRgbColors.forEach((color) => {
      it(`should validate ${color} as a valid rgb color`, () => {
        expect(utils.isColor(color)).toBeTruthy()
      })
    })

    invalidRgbColors.forEach((color) => {
      it(`should validate ${color} as an invalid rgb color`, () => {
        expect(utils.isColor(color)).toBeFalsy()
      })
    })

    validHslColors.forEach((color) => {
      it(`should validate ${color} as a valid hsl color`, () => {
        expect(utils.isColor(color)).toBeTruthy()
      })
    })

    invalidHslColors.forEach((color) => {
      it(`should validate ${color} as an invalid hsl color`, () => {
        expect(utils.isColor(color)).toBeFalsy()
      })
    })

    validColorNames.forEach((color) => {
      it(`should validate ${color} as a valid color name`, () => {
        expect(utils.isColor(color)).toBeTruthy()
      })
    })

    invalidColorNames.forEach((color) => {
      it(`should validate ${color} as an invalid color name`, () => {
        expect(utils.isColor(color)).toBeFalsy()
      })
    })
  }) // end isColor

  describe('isColor', function () {
    it('should return true for valid CSS colors', function () {
      const validColors = [
        '#f5f5f5',
        'rgb(255, 99, 71)',
        'hsl(120, 100%, 50%)',
        'rgba(255, 99, 71, 0.5)',
        'hsla(120, 100%, 50%, 0.5)',
        'transparent',
        'currentColor',
        'red',
        'green',
        'blue',
      ]
      validColors.forEach((value) => expect(utils.isColor(value)).toEqual(true))
    })

    it('should return false for invalid CSS colors', function () {
      const invalidColors = [
        '#f5f5f',
        'asdf',
        'browne',
        'rgb(25599, 71)',
        'hsl120, 100%, 50%)',
        '(255, 99, 71, 0.5)',
        '123456',
      ]
      invalidColors.forEach((value) => expect(utils.isColor(value)).toEqual(false))
    })

    it('should validate a valid color name with CSS.supports', () => {
      // Mock the CSS.supports function
      window.CSS = window.CSS || {}
      window.CSS.supports =
        window.CSS.supports ||
        function () {
          return true
        }
      const supportsSpy = vi.spyOn(window.CSS, 'supports').mockImplementation(() => true)

      expect(utils.isColor('red')).toBeTruthy()

      expect(supportsSpy).toHaveBeenCalled()
    })
  }) // end isColor

  describe('parseColor', function () {
    it('should return hex values for valid inputs', function () {
      const validColors = [
        '#f5f5f5',
        'rgb(255, 99, 71)',
        'hsl(120, 100%, 50%)',
        'red',
        'green',
        'blue',
      ]
      const expectedColors = ['#f5f5f5', '#ff6347', '#00ff00', '#ff0000', '#008000', '#0000ff']

      // TODO: I don't think handling transparent colors works very well
      validColors.forEach((value, index) =>
        expect(utils.parseColor(value)).toEqual(expectedColors[index])
      )
    })

    it('should return "transparent" for transparent', () => {
      expect(utils.parseColor('transparent')).toEqual('transparent')
    })

    it('should return "currentcolor" for currentColor', () => {
      expect(utils.parseColor('currentColor')).toEqual('currentcolor')
    })

    it('should use colorCache for known values', () => {
      const colorCache = new Map<string, string>()
      colorCache.set('red', '#ff0000')
      expect(utils.parseColor('red')).toBe('#ff0000')
    })
  }) // end parseColor

  describe('normalizeValidationResult', () => {
    it('should return valid=true and messages=[] when input is true', () => {
      const result = utils.normalizeValidationResult(true)
      expect(result.valid).toBe(true)
      expect(result.error).toBe(false)
      expect(result.messages).toEqual([])
    })

    it('should return valid=false and messages=[input message] when input is an object with message', () => {
      const input = { valid: false, message: 'error' }
      const result = utils.normalizeValidationResult(input)
      expect(result.valid).toBe(false)
      expect(result.error).toBe(false)
      expect(result.messages).toEqual(['error'])
    })

    it('should return valid=false and messages=[input messages] when input is an object with messages', () => {
      const input = { valid: false, messages: ['error 1', 'error 2'] }
      const result = utils.normalizeValidationResult(input)
      expect(result.valid).toBe(false)
      expect(result.error).toBe(false)
      expect(result.messages).toEqual(['error 1', 'error 2'])
    })

    it('should return valid=false and messages=[] when input is an object with messages as a string', () => {
      const input = { valid: false, messages: 'error' }
      const result = utils.normalizeValidationResult(input)
      expect(result.valid).toBe(false)
      expect(result.error).toBe(false)
      expect(result.messages).toEqual(['error'])
    })

    it('should return valid=false and error=true when input is an object with error=true', () => {
      const input = { valid: false, error: true }
      const result = utils.normalizeValidationResult(input)
      expect(result.valid).toBe(false)
      expect(result.error).toBe(true)
      expect(result.messages).toEqual([])
    })

    it('should return valid=false and messages with the string input is a string', () => {
      const input = 'error'
      const result = utils.normalizeValidationResult(input)
      expect(result.valid).toBe(false)
      expect(result.error).toBe(false)
      expect(result.messages).toEqual(['error'])
    })
  }) // end normalizeValidationResult
})
