import { Examples, Solution } from '~types'
import { map, min, reduce, splitEvery, swap } from 'ramda'

export const parse = (input: string) => {
  const [seeds, ...ranges] = input.split('\n\n').map((chunk) => chunk.match(/\d+/g)!.map(Number))

  return [seeds, ranges.map((range) => splitEvery(3, range))] as const
}

const seedToPos = (seed: number, ranges: ReturnType<typeof parse>[1]) =>
  ranges.reduce((pos, range) => {
    for (const [dest, source, len] of range) {
      const n = pos - source
      if (n >= 0 && n < len) {
        return dest + n
      }
    }
    return pos
  }, seed)

export const p1: Solution<typeof parse> = ([seeds, ranges]) =>
  reduce(
    min,
    Infinity,
    seeds.map((seed) => seedToPos(seed, ranges)),
  )

export const p2: Solution<typeof parse> = ([seeds, ranges]) => {
  const seedRanges = splitEvery(2, seeds)
  const isValidSeed = (seed: number) => seedRanges.some(([n, l]) => seed >= n && seed < n + l)
  const reversedRanges = ranges.reverse().map(map(swap(0, 1)))
  let pos = 0,
    seed = 0
  do {
    seed = seedToPos(++pos, reversedRanges)
  } while (!isValidSeed(seed) && pos < Number.MAX_SAFE_INTEGER)

  return pos
}

export const p1ex: Examples = [
  {
    expected: 35,
    input: `
      seeds: 79 14 55 13

      seed-to-soil map:
      50 98 2
      52 50 48

      soil-to-fertilizer map:
      0 15 37
      37 52 2
      39 0 15

      fertilizer-to-water map:
      49 53 8
      0 11 42
      42 0 7
      57 7 4

      water-to-light map:
      88 18 7
      18 25 70

      light-to-temperature map:
      45 77 23
      81 45 19
      68 64 13

      temperature-to-humidity map:
      0 69 1
      1 0 69

      humidity-to-location map:
      60 56 37
      56 93 4
     `,
  },
]

export const p2ex: Examples = [{ expected: 46, input: p1ex[0].input }]
