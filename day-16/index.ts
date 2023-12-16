import { Examples, Solution } from '~types'
import { range } from 'ramda'

type Dir = 'N' | 'E' | 'S' | 'W'
type Laser = {
  x: number
  y: number
  dir: Dir
}
type Cell = '.' | '|' | '-' | '/' | '\\'
type Grid = Cell[][]

export const parse = (input: string) => input.split('\n').map((line) => line.split('')) as Grid

const dxy = (dir: Dir) => {
  switch (dir) {
    case 'N':
      return [0, -1]
    case 'E':
      return [1, 0]
    case 'S':
      return [0, 1]
    case 'W':
      return [-1, 0]
  }
}
const pos = (x: number, y: number) => `${x},${y}`
const reflect = (mirror: '/' | '\\', dir: Dir) => {
  switch (dir) {
    case 'N':
      return mirror === '/' ? 'E' : 'W'
    case 'E':
      return mirror === '/' ? 'N' : 'S'
    case 'S':
      return mirror === '/' ? 'W' : 'E'
    case 'W':
      return mirror === '/' ? 'S' : 'N'
  }
}
const raycast = (grid: Grid, { x, y, dir }: Laser, energized: Set<string>): Laser[] => {
  const [dx, dy] = dxy(dir)
  do {
    x += dx
    y += dy
    const c = grid[y]?.[x]
    if (c) energized.add(pos(x, y))
    switch (c) {
      case '.':
        break
      case '|':
        if (dy !== 0) break
        return [
          { x, y, dir: 'N' },
          { x, y, dir: 'S' },
        ]
      case '-':
        if (dx !== 0) break
        return [
          { x, y, dir: 'E' },
          { x, y, dir: 'W' },
        ]
      case '/':
      case '\\':
        return [{ x, y, dir: reflect(c, dir) }]
      default:
        return []
    }
  } while (true)
}

const simulate = (grid: Grid, start: Laser) => {
  let lasers: Laser[] = [start]
  const energized = new Set<string>()
  const seen = new Set<string>()
  while (lasers.length) {
    const next = lasers
      .flatMap((laser) => raycast(grid, laser, energized))
      .map((laser) => [`${laser.x},${laser.y},${laser.dir}`, laser] as const)

    lasers = []
    for (const [key, laser] of next) {
      if (!seen.has(key)) {
        lasers.push(laser)
        seen.add(key)
      }
    }
  }

  return energized.size
}

export const p1: Solution<typeof parse> = (input) => {
  return simulate(input, { x: -1, y: 0, dir: 'E' })
}

export const p2: Solution<typeof parse> = (input) => {
  const [w, h] = [input[0].length, input.length]
  const lasers = [
    ...range(0, w).flatMap((x) => [
      { x, y: -1, dir: 'S' },
      { x, y: h, dir: 'N' },
    ]),
    ...range(0, h).flatMap((y) => [
      { x: -1, y, dir: 'E' },
      { x: w, y, dir: 'W' },
    ]),
  ] as Laser[]
  return lasers.reduce((acc, laser) => Math.max(acc, simulate(input, laser)), 0)
}

export const p1ex: Examples = [
  {
    expected: 46,
    input: `
      .|...\\....
      |.-.\\.....
      .....|-...
      ........|.
      ..........
      .........\\
      ..../.\\\\..
      .-.-/..|..
      .|....-|.\\
      ..//.|....
    `,
  },
]

export const p2ex: Examples = [{ expected: 51, input: p1ex[0].input }]
