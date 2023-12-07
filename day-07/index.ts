import { Examples, Solution } from '~types'
import { map, partition, pipe, sort, sum } from 'ramda'
import { mapIndexed } from '~utils'

const CARDS = '23456789TJQKA'.split('')
const CARDS_J = 'J23456789TQKA'.split('')
const TYPES = 'H123F45'.split('')

export const parse = (input: string) =>
  input.split('\n').map((line) => line.split(' ') as [string, string])

const cardMatcher = new RegExp(`${CARDS.map((c) => `(${c}+)`).join('|')}`, 'g')
export const cardsToType = (cards: string, withJoker = false) => {
  const sorted = cards.split('').sort().join('')
  let matches = sorted.match(cardMatcher) as string[]

  if (withJoker) {
    const [[jokers], [...rest]] = partition((m) => m[0] === 'J', matches)
    if (jokers) {
      matches = rest
        .sort((a, b) => (a.length === b.length ? b[0].localeCompare(a[0]) : b.length - a.length))
        .map((m, i) => (i === 0 ? m + jokers : m))
    }
  }

  switch (matches.length) {
    case 0: // 'JJJJJ'
    case 1:
      return '5'
    case 2:
      return matches.some((m) => m.length === 1) ? '4' : 'F'
    case 3:
      return matches.some((m) => m.length === 3) ? '3' : '2'
    case 4:
      return '1'
    default:
      return 'H'
  }
}
export const cardsToValue = (cards: string, withJoker = false) => {
  const type = cardsToType(cards, withJoker)
  const cardValues = withJoker ? CARDS_J : CARDS
  const values = [TYPES.indexOf(type), ...cards.split('').map((c) => cardValues.indexOf(c))]
  return values.map((i) => i.toString(16)).join('')
}

const solve = (withJokers = false) =>
  pipe(
    map(([cards, bid]) => [cardsToValue(cards, withJokers), +bid] as const),
    sort(([a], [b]) => a.localeCompare(b)),
    mapIndexed(([, bid], i) => bid * (i + 1)),
    sum,
  )

export const p1: Solution<typeof parse> = solve(false)
export const p2: Solution<typeof parse> = solve(true)

export const p1ex: Examples = [
  {
    expected: 6440,
    input: `32T3K 765
      T55J5 684
      KK677 28
      KTJJT 220
      QQQJA 483
    `,
  },
]

export const p2ex: Examples = [{ expected: 5905, input: p1ex[0].input }]
