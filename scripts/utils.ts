import { Submissions } from '~types'
import { stripIndents } from 'common-tags'
import puppeteer from 'puppeteer'
import { readDayFile, readSubmissionsFile } from './io.ts'
import { range, takeWhile } from 'ramda'

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

let bb: any = {}
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

async function renderChart(options = {}, path = 'chart.png') {
  const browser = await puppeteer.launch({ headless: 'new' })
  const page = await browser.newPage()

  // load billboard.js assets from CDN
  await page.addStyleTag({
    url: 'https://cdn.jsdelivr.net/npm/billboard.js/dist/theme/datalab.min.css',
  })
  await page.addScriptTag({
    url: 'https://cdn.jsdelivr.net/npm/billboard.js/dist/billboard.pkgd.min.js',
  })
  await page.addStyleTag({
    content: `
      body { background: #0f0f23; color: #ccc; fons-size: 16px; }
      .bb-axis line, .bb-axis .domain{
        stroke: #009900!important;
      }
      .bb-axis text, .bb-legend text {
        fill: #cccccc!important;
      }
    `,
  })

  await page.evaluate((options) => {
    bb.generate(options)
  }, options)

  const content = await page.$('.bb')

  // https://pptr.dev/#?product=Puppeteer&show=api-pagescreenshotoptions
  await content.screenshot({
    path,
    omitBackground: false,
    type: 'png',
  })

  await page.close()
  await browser.close()
}

export async function generateChart() {
  const submissions = await readSubmissionsFile()

  const locs = await Promise.all(
    range(1, 26).map(async (day) => {
      const source = await readDayFile(day)
      if (!source) return 0
      return takeWhile((line) => !/(p1ex|p2ex)/.test(line), source.split('\n')).length
    }),
  )
  const loc = (day: number) => locs[day - 1]
  const time1 = (day: number) => submissions[day - 1]?.part1?.time ?? 0
  const time2 = (day: number) => submissions[day - 1]?.part2?.time ?? 0

  const options = {
    data: {
      columns: [
        ['part1', 0, ...range(1, 26).map(time1)],
        ['part2', 0, ...range(1, 26).map(time2)],
        ['loc', 0, ...range(1, 26).map(loc)],
      ],
      types: {
        loc: 'area',
        part1: 'bar',
        part2: 'bar',
      },
      colors: {
        loc: '#ff0000',
        part1: '#9999cc',
        part2: '#ffff66',
      },
      axes: {
        loc: 'y2',
        part1: 'y',
        part2: 'y',
      },
    },
    axis: {
      x: {
        label: { text: 'Day', position: 'outer-center' },
      },
      y: {
        label: 'Execution time in ms',
      },
      y2: {
        show: true,
        label: 'Lines of code',
      },
    },
    bar: {
      padding: 2,
      width: {
        ratio: 0.5,
        max: 26,
      },
    },
  }

  await renderChart(options, 'chart.png')
}
