import { addIndex, map } from 'ramda'

export const mapIndexed = addIndex(map)

export const lcm = (...arr: number[]) => {
  const gcd = (x, y) => (!y ? x : gcd(y, x % y))
  const _lcm = (x, y) => (x * y) / gcd(x, y)
  return [...arr].reduce((a, b) => _lcm(a, b))
}
