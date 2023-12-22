import { Examples, Solution } from '~types'

export const parse = (input: string) =>
  input
    .split('\n')
    .map((line) => line.match(/^(\w)\s(\d+)\s\((.*)\)$/).slice(1, 4))
    .map(([dir, l, hex]) => [dir, +l, hex] as const)

const area = (instructions: [string, number][]) => {
  const [sum, l] = instructions.reduce(
    ([sum, l, y], [dir, n]) => {
      l += n
      switch (dir) {
        case 'U':
          return [sum, l, y - n]
        case 'D':
          return [sum, l, y + n]
        case 'L':
          return [sum + y * n, l, y]
        case 'R':
          return [sum - y * n, l, y]
      }
      return [sum, l, y]
    },
    [0, 0, 0],
  )
  return Math.abs(sum) + l / 2 + 1
}

export const p1: Solution<typeof parse> = (input) => area(input.map(([dir, l]) => [dir, l]))

const dirs = ['R', 'D', 'L', 'U']
const hexInstruction = (hex: string) =>
  [dirs[+hex.slice(-1)], Number.parseInt(hex.slice(1, -1), 16)] as [string, number]
export const p2: Solution<typeof parse> = (input) =>
  area(input.map(([, , hex]) => hexInstruction(hex)))

export const p1ex: Examples = [
  {
    expected: 42,
    input: `
      R 6 (#70c710)
      D 5 (#0dc571)
      L 6 (#5713f0)
      U 5 (#d2c081)
    `,
  },
  {
    expected: 62,
    input: `
      R 6 (#70c710)
      D 5 (#0dc571)
      L 2 (#5713f0)
      D 2 (#d2c081)
      R 2 (#59c680)
      D 2 (#411b91)
      L 5 (#8ceee2)
      U 2 (#caa173)
      L 1 (#1b58a2)
      U 2 (#caa171)
      R 2 (#7807d2)
      U 3 (#a77fa3)
      L 2 (#015232)
      U 2 (#7a21e3)
    `,
  },
]

export const p2ex: Examples = [{ expected: 952408144115, input: p1ex[1].input }]

export const onlyEx = true
