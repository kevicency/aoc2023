import { Examples, Solution } from '~types'
import { pipe, repeat, transpose, xprod } from 'ramda'

const expandRow = (universe: string[][]): string[][] =>
  universe.map((row) => (row.some((c) => c === '#') ? row : repeat('*', row.length)))
const expand = pipe(expandRow, transpose, expandRow, transpose)

export const parse = (input: string) => expand(input.split('\n').map((line) => line.split('')))

const solve =
  (n = 2) =>
  (input: ReturnType<typeof parse>) => {
    const galaxies = input.flatMap((line, y) =>
      line.flatMap((c, x) => (c === '#' ? [[x, y]] : [])),
    ) as [number, number][]
    const pairs = xprod(galaxies, galaxies)

    return (
      pairs.reduce((sum, [[px, py], [qx, qy]]) => {
        let [x, y] = [px, py]
        while (x !== qx || y !== qy) {
          if (x !== qx) x += px > qx ? -1 : 1
          else y += py > qy ? -1 : 1

          sum += input[y][x] === '*' ? n : 1
        }
        return sum
      }, 0) / 2
    )
  }
export const p1: Solution<typeof parse> = solve(2)

export const p2: Solution<typeof parse> = solve(1000000)

export const p1ex: Examples = [
  {
    expected: 374,
    input: `
    ...#......
    .......#..
    #.........
    ..........
    ......#...
    .#........
    .........#
    ..........
    .......#..
    #...#.....
  `,
  },
]

export const p2ex: Examples = [{ expected: 82000210, input: p1ex[0].input }]
