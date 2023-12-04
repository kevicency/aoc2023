import { Examples } from '~types'
import { range } from 'ramda'

type NumberEntry = { type: 'number'; x: number; y: number; value: number; length: number }
type SymbolEntry = { type: 'symbol'; x: number; y: number; value: string }

export const parse = (input: string) =>
  input
    .split('\n')
    .map((line) => [...line.matchAll(/(\d+|[^.])/g)])
    .flatMap((matches, y) =>
      matches.map(({ 1: match, index }) =>
        +match
          ? ({ type: 'number', value: +match, x: index, y, length: match.length } as const)
          : ({ type: 'symbol', value: match, x: index, y } as const),
      ),
    )
    .reduce(
      ({ numbers, symbols }, entry) => ({
        numbers: entry.type === 'number' ? [...numbers, entry] : numbers,
        symbols: entry.type === 'symbol' ? [...symbols, entry] : symbols,
      }),
      { numbers: [] as NumberEntry[], symbols: [] as SymbolEntry[] },
    )

const adjacentNumbers =
  (numbers: NumberEntry[]) =>
  ({ x: sx, y: sy }: SymbolEntry) =>
    numbers.filter((number) => {
      switch (Math.abs(number.y - sy)) {
        case 0:
          return number.x === sx + 1 || number.x + number.length === sx
        case 1:
          const xs = range(number.x - 1, number.x + number.length + 1)
          return xs.includes(sx)
        default:
          return false
      }
    })

export const p1 = ({ numbers, symbols }: ReturnType<typeof parse>) => {
  const partNumbers = symbols.flatMap(adjacentNumbers(numbers)).reduce((acc, { x, y, value }) => {
    acc.set(`${x},${y}`, value)
    return acc
  }, new Map<string, number>())

  return [...partNumbers.values()].reduce((acc, partNumber) => acc + partNumber, 0)
}

export const p2 = ({ numbers, symbols }: ReturnType<typeof parse>) =>
  symbols
    .filter(({ value }) => value === '*')
    .map(adjacentNumbers(numbers))
    .filter((adjacent) => adjacent.length === 2)
    .map(([a, b]) => a.value * b.value)
    .reduce((acc, gearRatio) => acc + gearRatio, 0)

export const p1ex: Examples = [
  {
    expected: 43610,
    input: `
      467..114..
      ...*......
      ..35..633.
      ......#...
      617*......
      .....+.58.
      ..592.....
      ......755.
      ...$.*....
      .664.598..
    `,
  },
]

export const p2ex: Examples = [
  {
    expected: 467835,
    input: `
      467..114..
      ...*......
      ..35..633.
      ......#...
      617*......
      .....+.58.
      ..592.....
      ......755.
      ...$.*....
      .664.598..
    `,
  },
]
