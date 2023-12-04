export const formatDay = (day: number | string) => {
  const parsedDay = Number(day)
  return String(parsedDay).padStart(2, '0')
}

export const formatDayName = (day: number | string) => {
  return `day-${formatDay(day)}`
}

export const validateDay = (day: number | string) => {
  const parsedDay = Number(day)
  return day && !Number.isNaN(parsedDay) && parsedDay >= 1 && parsedDay <= 25
}

export const generateTemplate = (day: number) => `import { splitLines } from '~utils'
import { Examples } from '~types'

export const parse = splitLines

export const p1 = (input: ReturnType<typeof parse>) => input

export const p2 = (input: ReturnType<typeof parse>) => input

export const p1ex: Examples = [
  { expected: 0, input: '' },
]

export const p2ex: Examples = [
  { expected: 0, input: '' },
]

// export const onlyEx = true
`

export const generateTestTemplate = (day: number) => `import { expect, test } from 'bun:test'
import { parse } from './index.ts'

test(\`parse\`, () => {
  expect(parse('')).toBeTruthy()
})
`

export const withPerformance = <T>(handler: () => T) => {
  const start = performance.now()
  const result = handler()
  const end = performance.now()

  return [result, end - start] as const
}

export const formatPerformance = (time: number) => {
  const round = (x: number) => Math.round((x + Number.EPSILON) * 100) / 100
  if (time < 1) {
    return `${round(time * 1000)} µs`
  }
  return `${round(time)} ms`
}
export const isNumber = (value: any): value is number => typeof value === 'number'
export const isString = (value: any): value is string => typeof value === 'string'
export const isStringOrNumber = (value: any): value is string | number =>
  isNumber(value) || isString(value)

export const aocYear = () => {
  const envYear = +(Bun.env.YEAR ?? '')
  return envYear || new Date().getFullYear()
}
