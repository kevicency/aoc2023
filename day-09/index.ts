import { Examples, Solution } from '~types'
import { curry } from 'ramda'

export const parse = (input: string) => input.replace(/\r/g, '')

export function predict(str: string): number {
  const history = str.split(' ').map(Number)

  const seq = [history]

  while (seq.at(-1).some((n) => n !== 0)) {
    const last = seq.at(-1)
    const next = last.slice(1).map((v, i) => v - last[i])

    seq.push(next)
  }

  seq.at(-1).push(0)

  for (let i = seq.length - 2; i >= 0; i--) {
    seq[i].push(seq[i].at(-1) + seq[i + 1].at(-1))
  }

  return seq[0].at(-1)
}

const getExtrapolatedSum = curry((backwards = false, input: string) =>
  input
    .split('\n')
    .map((line) => (backwards ? line.split(' ').reverse().join(' ') : line))
    .map(predict)
    .reduce((acc, n) => acc + n, 0),
)

export const p1: Solution<typeof parse> = getExtrapolatedSum

export const p2: Solution<typeof parse> = getExtrapolatedSum(true)

export const p1ex: Examples = [{ expected: 0, input: '' }]

export const p2ex: Examples = [{ expected: 0, input: '' }]

export const onlyEx = true
