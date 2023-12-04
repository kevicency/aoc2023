import { Submissions } from '~types'
import { stripIndents } from 'common-tags'

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

export const renderDayBadges = (submissions: Submissions) => {
  return submissions
    .map(({ part1, part2 }, index) => {
      const day = String(index + 1).padStart(2, '0')

      const color =
        (part1.solved && part2.solved) || (part1.solved && day === '25')
          ? 'green'
          : part1.solved || part2.solved
            ? 'yellow'
            : 'gray'

      const badge = `![Day](https://badgen.net/badge/${day}/%E2%98%8${
        part1.solved ? 5 : 6
      }%E2%98%8${part2.solved || (part1.solved && day === '25') ? 5 : 6}/${color})`

      return color !== 'gray' ? `[${badge}](${formatDayName(day)}/index.ts)` : badge
    })
    .join('\n')
}

export const renderResults = (submissions: Submissions) => {
  let totalTime = 0
  let totalStars = 0

  const results = submissions
    .map(({ part1, part2 }, index) => {
      const day = String(index + 1).padStart(2, '0')

      let timeBoth = 0

      if (part1.solved) {
        totalStars++
        totalTime += part1.time ?? 0
        timeBoth += part1.time ?? 0
      }
      if (part2.solved) {
        totalStars++
        totalTime += part2.time ?? 0
        timeBoth += part2.time ?? 0
      }

      if (day === '25' && part1.solved) {
        totalStars++
      }

      return stripIndents`
      \`\`\`
      Day ${day}
      Time part 1: ${part1.time !== null && part1.solved ? formatPerformance(part1.time) : '-'}
      Time part 2: ${part2.time !== null && part2.solved ? formatPerformance(part2.time) : '-'}
      Both parts: ${timeBoth !== 0 ? formatPerformance(timeBoth) : '-'}
      \`\`\`
    `
    })
    .join('\n\n')

  const summary = stripIndents`
    \`\`\`
    Total stars: ${totalStars}/50
    Total time: ${formatPerformance(totalTime)}
    \`\`\`
  `

  return [results, summary].join('\n\n')
}
