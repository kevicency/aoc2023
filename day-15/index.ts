import { Examples, Solution } from '~types'
import { map, pipe, product, sum } from 'ramda'

export const parse = (input: string) => input.replace('\n', '').split(',')

const hash = (input: string) =>
  input
    .split('')
    .map((c) => c.charCodeAt(0))
    .reduce((acc, n) => ((acc + n) * 17) % 256, 0)

export const p1: Solution<typeof parse> = pipe(map(hash), sum)

type Lens = { label: string; focal: string }
type Box = Lens[]
export const p2: Solution<typeof parse> = (input) => {
  const boxes = input
    .map((seq) => seq.match(/(\w+)([=-])(\d)?/).slice(1) as string[])
    .map((match) => [hash(match[0]), ...match] as string[])
    .reduce(
      (acc, [h, label, op, focal]) => {
        let box: Box = acc[h] ?? []

        if (op === '=') {
          const i = box.findIndex((b) => b.label === label)
          box[i === -1 ? box.length : i] = { label, focal }
        }
        if (op == '-') {
          box = box.filter((b) => b.label !== label)
        }

        acc[h] = box

        return acc
      },
      {} as Record<number, Box>,
    )

  return Object.entries(boxes)
    .flatMap(([b, box]) => box.map(({ focal }, i) => [+b + 1, i + 1, +focal]))
    .map(product)
    .reduce((acc, n) => acc + n, 0)
}

export const p1ex: Examples = [
  { expected: 1320, input: 'rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7' },
]

export const p2ex: Examples = [{ expected: 145, input: p1ex[0].input }]
