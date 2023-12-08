import { Examples, Solution } from '~types'
import { match } from 'ramda'
import { lcm } from '~utils'

export const parse = (input: string) => {
  const [dirs, nodes] = input.split('\n\n')
  return [
    dirs,
    nodes
      .split('\n')
      .map(match(/\w+/g))
      .reduce((acc, [d, l, r]) => {
        acc.set(d, [l, r])
        return acc
      }, new Map<string, [string, string]>()),
  ] as const
}

const solve = (
  [dirs, nodes]: ReturnType<typeof parse>,
  done: (node: string) => boolean,
  pos: string,
  step = 0,
) => {
  if (done(pos)) return step
  const [l, r] = nodes.get(pos)!
  const dir = dirs[step % dirs.length]
  return solve([dirs, nodes], done, dir === 'L' ? l : r, step + 1)
}
export const p1: Solution<typeof parse> = (input) => solve(input, (node) => node === 'ZZZ', 'AAA')
export const p2: Solution<typeof parse> = ([dirs, nodes]) => {
  const start = [...nodes.keys()].filter((node) => node.endsWith('A'))
  const steps = start.map((pos) => solve([dirs, nodes], (node) => node.endsWith('Z'), pos))

  return lcm(...steps)
}

export const p1ex: Examples = [
  {
    expected: 2,
    input: `
      RL

      AAA = (BBB, CCC)
      BBB = (DDD, EEE)
      CCC = (ZZZ, GGG)
      DDD = (DDD, DDD)
      EEE = (EEE, EEE)
      GGG = (GGG, GGG)
      ZZZ = (ZZZ, ZZZ)
    `,
  },
]

export const p2ex: Examples = [
  {
    expected: 6,
    input: `
      LR

      11A = (11B, XXX)
      11B = (XXX, 11Z)
      11Z = (11B, XXX)
      22A = (22B, XXX)
      22B = (22C, 22C)
      22C = (22Z, 22Z)
      22Z = (22B, 22B)
      XXX = (XXX, XXX)
    `,
  },
]
