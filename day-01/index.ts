import { splitLines } from '~utils'
import { Examples } from '~types'
import { head, last, map, match, nth, pipe, sum } from 'ramda'

export const parse = splitLines

const solve = (matcher: (line: string) => (string | number)[]) =>
  pipe(
    map(matcher),
    map(([x, y]) => +`${x}${y}`),
    sum,
  )

const firstAndLast = <T>(arr: T[]) => [head(arr), last(arr)]
export const p1 = solve(pipe(match(/\d/g), firstAndLast))

const words = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']
const regex = new RegExp(`(?=(\\d|${words.join('|')}))`, 'g')
const wordToDigit = (word: string) => +word || words.indexOf(word) + 1
export const p2 = solve(
  pipe(
    // prettier-preserve-linebreaks
    (line) => Array.from(line.matchAll(regex)),
    map(nth(1)),
    firstAndLast,
    map(wordToDigit),
  ),
)

export const p1ex: Examples = [
  {
    expected: 142,
    input: `
      1abc2
      pqr3stu8vwx
      a1b2c3d4e5f
      treb7uchet
    `,
  },
]

export const p2ex: Examples = [
  {
    expected: 281,
    input: `
      two1nine
      eightwothree
      abcone2threexyz
      xtwone3four
      4nineeightseven2
      zoneight234
      7pqrstsixteen
    `,
  },
  {
    expected: 21,
    input: `
      twone
    `,
  },
]
