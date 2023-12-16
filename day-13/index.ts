import { Examples, Solution } from '~types'
import { range, take, transpose, zip } from 'ramda'

export const parse = (input: string) => input.split('\n\n').map((grid) => grid.split('\n'))

type Grid = string[]
export const split = <T = any>(grid: T[], at: number, count: number) => [
  take(count)(grid.slice(at + 1 - count)),
  take(count)(grid.slice(at + 1)),
]
export const countDifferences = <T extends string>(top: T[], bottom: T[]) =>
  zip(
    top.flatMap((line) => line.split('')),
    bottom.reverse().flatMap((line) => line.split('')),
  )
    .map(([a, b]) => +(a !== b))
    .reduce((acc, n) => acc + n)
const findReflection = (grid: Grid, smudges: number) => {
  const h = grid.length

  for (const i of range(0, h - 1)) {
    const count = Math.min(i + 1, h - i - 1)
    const [top, bottom] = split(grid, i, count)

    if (countDifferences(top, bottom) === smudges) {
      return i
    }
  }

  return -1
}
const rotate = (grid: Grid) =>
  transpose(grid.map((line) => line.split(''))).map((row) => row.join(''))

const solveOne = (grid: Grid, smudges: number) => {
  let i = findReflection(grid, smudges)
  if (i !== -1) {
    return (i + 1) * 100
  }
  return 1 + findReflection(rotate(grid), smudges)
}
const solve = (smudges: number) => (input: ReturnType<typeof parse>) =>
  input.map((grid) => solveOne(grid, smudges)).reduce((acc, n) => acc + n)

export const p1: Solution<typeof parse> = solve(0)
export const p2: Solution<typeof parse> = solve(1)

export const p1ex: Examples = [
  {
    expected: 405,
    input: `
      #.##..##.
      ..#.##.#.
      ##......#
      ##......#
      ..#.##.#.
      ..##..##.
      #.#.##.#.
      
      #...##..#
      #....#..#
      ..##..###
      #####.##.
      #####.##.
      ..##..###
      #....#..# 
    `,
  },
]

export const p2ex: Examples = [{ expected: 400, input: p1ex[0].input }]
