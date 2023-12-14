import { Examples, Solution } from '~types'
import { transpose } from 'ramda'

type Dir = 'N' | 'S' | 'W' | 'E'
export const parse = (input: string) => input.split('\n').map((line) => line.split(''))

const tiltOne = (dir: Dir) => (platform: ReturnType<typeof parse>) => {
  let dir2 = dir
  if (dir === 'W' || dir === 'E') {
    platform = transpose(platform)
    dir = dir === 'W' ? 'N' : 'S'
  }
  let result = 0
  for (let i = 0; i < platform.length; i++) {
    const y = dir === 'N' ? i : platform.length - i - 1
    const current = platform[y]
    const next = platform[y + (dir === 'N' ? 1 : -1)]
    if (!next) continue

    for (let x = 0; x < current.length; x++) {
      const c = current[x]
      const n = next[x]

      if (n === 'O' && c === '.') {
        current[x] = 'O'
        next[x] = '.'
        result += 1
      }
    }
  }
  if (dir2 === 'W' || dir2 === 'E') {
    platform = transpose(platform)
  }
  return [result, platform] as const
}

const stringify = (platform: ReturnType<typeof parse>) =>
  platform.map((row) => row.join('')).join('\n')

const tilt = (dir: Dir) => (platform: ReturnType<typeof parse>) => {
  let n = 0
  do {
    ;[n, platform] = tiltOne(dir)(platform)
  } while (n > 0)

  return platform
}

const weight = (platform: ReturnType<typeof parse>) => {
  return platform
    .map((row, i) => row.filter((c) => c === 'O').length * (platform.length - i))
    .reduce((acc, n) => acc + n, 0)
}
export const p1: Solution<typeof parse> = (input) => weight(tilt('N')(input))

export const p2: Solution<typeof parse> = (input) => {
  const cache = new Map<string, number>()
  const dirs = ['N', 'W', 'S', 'E'] as const
  const N = 1_000_000_000
  for (let i = 0; i < N; i++) {
    for (const dir of dirs) {
      input = tilt(dir)(input)
      const key = dir + stringify(input)
      const n = cache[key]
      if (n > 0) {
        const cycleLength = i - n
        const m = (N - i) / cycleLength
        i = i + Math.floor(m) * cycleLength
      }
      cache[key] = i
    }
  }

  return weight(input)
}

export const p1ex: Examples = [
  {
    expected: 136,
    input: `
      O....#....
      O.OO#....#
      .....##...
      OO.#O....O
      .O.....O#.
      O.#..O.#.#
      ..O..#O..O
      .......O..
      #....###..
      #OO..#....
    `,
  },
]

export const p2ex: Examples = [{ expected: 64, input: p1ex[0].input }]
