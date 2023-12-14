import { Examples, Solution } from '~types'
import { range } from 'ramda'

type Pipe = '|' | '-' | 'L' | 'J' | '7' | 'F'
type Cell = Pipe | '.' | 'S'
class Grid extends Map<string, Cell> {}

const pos = (x: number, y: number) => `${x},${y}` as const
const xy = (pos: string) => pos.split(',').map(Number) as [number, number]

const north = /[|LJ]/
const south = /[|7F]/
const west = /[-J7]/
const east = /[-LF]/

export const parse = (input: string) => {
  let start = ''
  const grid = input.split('\n').reduce((acc, line, y) => {
    line.split('').forEach((c, x) => {
      acc.set(pos(x, y), c as Cell)
      if (c === 'S') start = pos(x, y)
    })
    return acc
  }, new Grid())

  const [x, y] = xy(start)
  // reverse engineer the start cell
  const n = grid.get(pos(x, y - 1))?.match(south)
  const s = grid.get(pos(x, y + 1))?.match(north)
  const w = grid.get(pos(x - 1, y))?.match(east)
  const e = grid.get(pos(x + 1, y))?.match(west)

  if (n && s) grid.set(start, '|')
  if (w && e) grid.set(start, '-')
  if (n) grid.set(start, w ? 'J' : 'L')
  if (s) grid.set(start, w ? '7' : 'F')

  return [start, grid] as const
}

const loop = (grid: Grid, path: [string, ...string[]]) => {
  const start = path[0]
  const current = path.at(-1)

  if (current === start && path.length > 1) return path.slice(0, -1)

  const last = path.at(-2)
  const [x, y] = xy(current)
  const [lx, ly] = last ? xy(last) : [x, y]

  if (ly != y + 1 && grid.get(current)?.match(south)) {
    return loop(grid, [...path, pos(x, y + 1)])
  }
  if (ly != y - 1 && grid.get(current)?.match(north)) {
    return loop(grid, [...path, pos(x, y - 1)])
  }
  if (lx != x - 1 && grid.get(current)?.match(west)) {
    return loop(grid, [...path, pos(x - 1, y)])
  }
  if (lx != x + 1 && grid.get(current)?.match(east)) {
    return loop(grid, [...path, pos(x + 1, y)])
  }

  throw [current, last]
}

export const p1: Solution<typeof parse> = ([start, grid]) => loop(grid, [start]).length / 2

export const p2: Solution<typeof parse> = ([start, grid]) => {
  const path = loop(grid, [start])
  const [w, h] = [...grid.keys()]
    .map(xy)
    .reduce(([w, h], [x, y]) => [Math.max(w, x + 1), Math.max(h, y + 1)], [0, 0])

  const outside = new Set<string>(path)
  for (const y of range(0, h)) {
    let inside = false
    let up = false

    for (const x of range(0, w)) {
      const current = pos(x, y)
      const pipe = path.includes(current) ? grid.get(current) : '.'
      if (pipe === '|') {
        inside = !inside
      } else if ('LF'.includes(pipe)) {
        up = pipe === 'L'
      } else if ('7J'.includes(pipe)) {
        if (up ? pipe !== 'J' : pipe !== '7') inside = !inside
        up = false
      }

      if (!inside) outside.add(current)
    }
  }

  return w * h - outside.size
}

export const p1ex: Examples = [
  {
    expected: 8,
    input: `
    7-F7-
    .FJ|7
    SJLL7
    |F--J
    LJ.LJ
  `,
  },
]

export const p2ex: Examples = [{ expected: 1, input: p1ex[0].input }]
