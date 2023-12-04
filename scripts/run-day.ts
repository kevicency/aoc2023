import chalk from 'chalk'
import {
  formatDay,
  formatDayName,
  formatPerformance,
  isStringOrNumber,
  validateDay,
  withPerformance,
} from './utils.ts'
import { Examples } from '~types'
import { stripIndents } from 'common-tags'

type RunConfig = {
  name: 'one' | 'two'
  part: (input: any) => any
  input: string
  parse?: (input: string) => any
  examples?: Examples
  examplesOnly?: boolean
}
export type RunResult = {
  success: boolean
  result: any
  performance: number
}

const runPart = ({ name, part, examples, parse, input, examplesOnly }: RunConfig): RunResult => {
  let exampleFailed = false
  for (const example of examples ?? []) {
    const exInput = stripIndents(example.input.trim())
    if (exInput === '') continue
    const i = examples?.indexOf(example)
    const [result, performance] = withPerformance(() => part?.(parse ? parse(exInput) : exInput))
    if (result == example.expected) {
      console.log(
        chalk.green(`✅  Part ${name}, Ex #${i} - passed (${formatPerformance(performance)})`),
      )
    } else {
      exampleFailed = true
      console.log(
        chalk.yellow(`❌  Part ${name}, Ex #${i} - failed (${formatPerformance(performance)})`),
      )
      console.log(chalk.reset('Expected: '), chalk.green(example.expected))
      console.log(chalk.reset('Result: '))
      console.dir(result, { colors: true, depth: null })
      console.log()
    }
  }

  console.log()

  const [result, performance] = examplesOnly
    ? [null, 0]
    : withPerformance(() => part?.(parse ? parse(input) : input))

  if (isStringOrNumber(result)) {
    console.log(
      '🎄',
      `Part ${name}:`,
      chalk.green(result ?? '—'),
      `(${formatPerformance(performance)})`,
    )
  } else if (examplesOnly) {
    console.log(chalk.yellow(`⏩  Part ${name} skipped because only examples.`))
  } else {
    console.log(`🖨️ Part ${name} (${formatPerformance(performance)}):`)
    console.dir(result, { colors: true, depth: null })
  }

  console.log()

  return { success: !exampleFailed && isStringOrNumber(result), result, performance }
}

export const runDay = async (
  day: number,
  opts: { isDevMode?: boolean; isSubmit?: boolean; skipPart1?: boolean; skipPart2?: boolean } = {},
) => {
  if (!opts.isDevMode) {
    console.clear()
  }

  if (!validateDay(day)) {
    console.log(`🎅 Pick a day between ${chalk.bold(1)} and ${chalk.bold(25)}.`)
    console.log(`🎅 To get started, try: ${chalk.cyan('bun day 1')}`)
    return
  }

  const file = Bun.file(`./${formatDayName(day)}/index.ts`)
  const fileExists = await file.exists()

  if (!fileExists) {
    console.log(chalk.red(`Day ${formatDay(day)} does not exist!`))
    return
  }

  const inputFile = Bun.file(`./${formatDayName(day)}/input.txt`)
  const inputExists = await file.exists()

  if (!inputExists) {
    console.log(chalk.red(`Day ${formatDay(day)} input does not exist!`))
    return
  }

  const input = (await inputFile.text()).trim()
  const { p1, p1ex, p2, p2ex, parse, onlyEx } = await import(`../${formatDayName(day)}/index.ts`)
  const examplesOnly = !opts.isSubmit && Boolean(onlyEx)

  const part1 = !opts.skipPart1
    ? runPart({ name: 'one', part: p1, examples: p1ex, input, parse, examplesOnly })
    : { success: true, result: null, performance: 0 }

  console.log()

  const part2 =
    !opts.skipPart2 && (part1.success || onlyEx)
      ? runPart({ name: 'two', part: p2, examples: p2ex, input, parse, examplesOnly })
      : null

  console.log()

  return { part1, part2 }
}

if (Bun.argv[1].endsWith('run-day.ts')) {
  const day = Number(Bun.argv[2] ?? '')
  const isDevMode = Bun.argv[3] === '--dev'
  await runDay(day, { isDevMode })
}
