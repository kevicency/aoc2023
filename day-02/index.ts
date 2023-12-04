import { Examples } from '~types'

const colors = ['red', 'green', 'blue']

export const parse = (input: string) =>
  input
    .split('\n')
    .map((line) => line.split(':'))
    .map(
      ([game, rounds]) =>
        [
          +game.match(/\d+/)[0],
          rounds
            .split(';')
            .flatMap((round) =>
              round.split(',').map((x) => {
                const [count, color] = x.trim().split(' ')
                return [colors.indexOf(color), +count] as const
              }),
            )
            .reduce(
              (acc, [i, count]) => [
                ...acc.slice(0, i),
                Math.max(acc[i] ?? 0, count),
                ...acc.slice(i + 1),
              ],
              [0, 0, 0],
            ),
        ] as const,
    )

export const p1 = (input: ReturnType<typeof parse>) =>
  input.filter(([, [r, g, b]]) => r <= 12 && g <= 13 && b <= 14).reduce((acc, [id]) => acc + id, 0)

export const p2 = (input: ReturnType<typeof parse>) =>
  input.map(([, [r, g, b]]) => r * g * b).reduce((acc, pow) => acc + pow, 0)

export const p1ex: Examples = [
  {
    expected: 8,
    input: `
      Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
      Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
      Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
      Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
      Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green
    `,
  },
]

export const p2ex: Examples = [
  {
    expected: 2286,
    input: `
      Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
      Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
      Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
      Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
      Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green
    `,
  },
]
