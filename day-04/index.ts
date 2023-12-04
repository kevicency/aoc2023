import { Examples } from '~types'
import { intersection, range } from 'ramda'

export const parse = (input: string) =>
  input
    .split('\n')
    .map((line) => line.split(':'))
    .map(
      ([card, numbers]) =>
        [
          +card.match(/\d+/),
          ...numbers.split('|').map((x) => x.trim().split(/\s+/).map(Number)),
        ] as const,
    )
    .map(([id, winning, having]) => [id, intersection(winning, having)] as const)
    .map(([id, numbers]) => [id, numbers.length] as const)

export const p1 = (input: ReturnType<typeof parse>) =>
  input.map(([_, n]) => (n > 0 ? Math.pow(2, n - 1) : 0)).reduce((acc, n) => acc + n, 0)

export const p2 = (input: ReturnType<typeof parse>) => {
  return input
    .reduce(
      (acc, [id, n]) => {
        for (const i of range(id + 1, id + 1 + n)) {
          acc[i] ??= 0
          acc[i] += 1 * acc[id]
        }
        return acc
      },
      [0, ...input.map(() => 1)],
    )
    .reduce((acc, n) => acc + n, 0)
}

export const p1ex: Examples = [
  {
    expected: 13,
    input: `
      Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
      Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
      Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
      Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
      Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
      Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11
    `,
  },
]

export const p2ex: Examples = [
  {
    expected: 30,
    input: `
      Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
      Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
      Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
      Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
      Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
      Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11
    `,
  },
]

// export const onlyEx = true
