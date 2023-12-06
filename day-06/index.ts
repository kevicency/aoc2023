import { Examples, Solution } from '~types'
import { join, map, match, pipe, product, range, split, transpose } from 'ramda'

export const parse = pipe(split('\n'), map(match(/\d+/g)))

const solve = ([t, d]: number[]) => range(0, t + 1).filter((n) => n * (t - n) > d).length
export const p1: Solution<typeof parse> = pipe(map(map(Number)), transpose, map(solve), product)
export const p2: Solution<typeof parse> = pipe(map(join('')), map(Number), solve)

export const p1ex: Examples = [
  {
    expected: 288,
    input: `
      Time:      7  15   30
      Distance:  9  40  200
    `,
  },
]

export const p2ex: Examples = [{ expected: 71503, input: p1ex[0].input }]

export const onlyEx = true
