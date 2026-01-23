import * as utils from '../src/validator-utils'
// @ts-ignore
import { describe, it, expect } from 'vitest'

describe('real-world date/time formats', () => {
  const cases: Array<[string, Date]> = [
    ['20210314T150926Z', new Date(2021, 2, 14, 15, 9, 26)],
    ['20210314T1509+0200', new Date(2021, 2, 14, 15, 9, 0)],
    ['2021-03-14T15:09:26Z', new Date(2021, 2, 14, 15, 9, 26)],
    ['2021-03-14T15:09:26+02:00', new Date(2021, 2, 14, 15, 9, 26)],
    ['2021-03-14 15:09:26+0200', new Date(2021, 2, 14, 15, 9, 26)],
    ['2021-03-14 15:09:26 UTC', new Date(2021, 2, 14, 15, 9, 26)],
    ['2021-03-14 15:09:26.123', new Date(2021, 2, 14, 15, 9, 26)],
    ['2021-03-14 15:09:26,123', new Date(2021, 2, 14, 15, 9, 26)],
    ['2021-03-14 15.09.26', new Date(2021, 2, 14, 15, 9, 26)],
    ['2021-03-14 15.09', new Date(2021, 2, 14, 15, 9, 0)],
    ['Sun, 06 Nov 1994 08:49:37 GMT', new Date(1994, 10, 6, 8, 49, 37)],
    ['Mon Mar 14 15:09:26 2022', new Date(2022, 2, 14, 15, 9, 26)],
    [
      'Mon Mar 14 2022 15:09:26 GMT-0700 (Pacific Daylight Time)',
      new Date(2022, 2, 14, 15, 9, 26),
    ],
    ['Mar 14th, 2021 3:15 PM', new Date(2021, 2, 14, 15, 15, 0)],
    ['14 Mar 2021 15:09', new Date(2021, 2, 14, 15, 9, 0)],
    ['2021-03-14 at 3:15 PM', new Date(2021, 2, 14, 15, 15, 0)],
    ['03/14/2021 3:15 PM', new Date(2021, 2, 14, 15, 15, 0)],
    ['14/03/2021 15:09', new Date(2021, 2, 14, 15, 9, 0)],
    ['2021.03.14 15:09:26', new Date(2021, 2, 14, 15, 9, 26)],
    ['2021/03/14 15:09', new Date(2021, 2, 14, 15, 9, 0)],
    ['2021-03-14 3pm', new Date(2021, 2, 14, 15, 0, 0)],
    ['2021-03-14 3 PM PST', new Date(2021, 2, 14, 15, 0, 0)],
    ['2021-03-14T15:09', new Date(2021, 2, 14, 15, 9, 0)],
  ]

  cases.forEach(([input, expected]) => {
    it(`parses "${input}"`, () => {
      expect(utils.parseDateTime(input)).toEqual(expected)
    })
  })
})

describe('real-world date-only formats', () => {
  const cases: Array<[string, Date]> = [
    ['2021-03-14', new Date(2021, 2, 14)],
    ['20210314', new Date(2021, 2, 14)],
    ['14 Mar 2021', new Date(2021, 2, 14)],
    ['Mar 14, 2021', new Date(2021, 2, 14)],
    ['Mar 14th, 2021', new Date(2021, 2, 14)],
    ['14/03/2021', new Date(2021, 2, 14)],
    ['03/14/2021', new Date(2021, 2, 14)],
    ['2021.03.14', new Date(2021, 2, 14)],
    ['Sun, 14 Mar 2021', new Date(2021, 2, 14)],
    ['2021-03-14Z', new Date(2021, 2, 14)],
    ['2021/03/14 UTC', new Date(2021, 2, 14)],
  ]

  cases.forEach(([input, expected]) => {
    it(`parses "${input}"`, () => {
      expect(utils.parseDate(input)).toEqual(expected)
    })
  })
})

describe('probably not worth it (todo)', () => {
  it.todo('ISO week date: 2021-W10-7')
  it.todo('ISO ordinal date: 2021-073')
  it.todo('Hour-minute tokens: 2021-03-14 3h15m')
})
