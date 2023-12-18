import { Examples, Solution } from '~types'
import Heap from 'heap-js'

type Grid = number[][]
export const parse = (input: string) =>
  input.split('\n').map((line) => line.split('').map(Number)) as Grid

type Position = {
  x: number
  y: number
  dx: number
  dy: number
  heat: number
  consecutive: number
}
const fns = {
  visited:
    (cache: Set<string>) =>
    ({ heat, ...rest }: Position) => {
      const key = JSON.stringify(rest)
      if (cache.has(key)) return true
      cache.add(key)
      return false
    },
  move:
    (grid: Grid, positions: Heap<Position>, min: number, max: number) =>
    (current: Position, dx: number, dy: number) => {
      const straight =
        (current.dx === dx && current.dy === dy) || (current.x === 0 && current.y === 0)
      const backwards = dx === -current.dx && dy === -current.dy
      const next: Omit<Position, 'heat'> = {
        x: current.x + dx,
        y: current.y + dy,
        dx,
        dy,
        consecutive: straight ? current.consecutive + 1 : 1,
      }
      const heat = grid[next.y]?.[next.x]

      if (!heat) return
      if (backwards) return
      if (next.consecutive > max) return
      if (current.consecutive < min && !straight) return

      positions.push({
        ...next,
        heat: current.heat + heat,
      })
    },
}
export const solve = (min: number, max: number) => (grid: Grid) => {
  const positions = new Heap<Position>((a, b) => a.heat - b.heat)
  const seen = new Set<string>()
  const [visited, move] = [fns.visited(seen), fns.move(grid, positions, min, max)]
  const [endX, endY] = [grid[0].length - 1, grid.length - 1]
  positions.push({ x: 0, y: 0, dx: 0, dy: 0, heat: 0, consecutive: 0 })

  while (positions.length > 0) {
    const current = positions.pop()

    if (visited(current)) continue
    if (current.x === endX && current.y === endY && current.consecutive >= min) return current.heat

    move(current, 1, 0)
    move(current, -1, 0)
    move(current, 0, 1)
    move(current, 0, -1)
  }

  return 'No path found'
}

export const p1: Solution<typeof parse> = solve(0, 3)

export const p2: Solution<typeof parse> = solve(4, 10)

export const p1ex: Examples = [
  {
    expected: 102,
    input: `
      2413432311323
      3215453535623
      3255245654254
      3446585845452
      4546657867536
      1438598798454
      4457876987766
      3637877979653
      4654967986887
      4564679986453
      1224686865563
      2546548887735
      4322674655533
    `,
  },
]

export const p2ex: Examples = [{ expected: 94, input: p1ex[0].input }]
