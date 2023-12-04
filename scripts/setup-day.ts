import { existsSync } from 'node:fs'
import { mkdir } from 'node:fs/promises'
import chalk from 'chalk'
import {
  formatDay,
  formatDayName,
  generateTemplate,
  generateTestTemplate,
  validateDay,
} from './utils.ts'
import { fetchInput } from './api.ts'

const setupDay = async (day: number) => {
  if (!validateDay(day)) {
    console.log(`🎅 Pick a day between ${chalk.bold(1)} and ${chalk.bold(25)}.`)
    console.log(`🎅 To get started, try: ${chalk.cyan('bun setup 1')}`)
    return
  }

  const dir = new URL(`../${formatDayName(day)}/`, import.meta.url)

  if (existsSync(dir)) {
    console.log(chalk.red(`Day ${day} already exists!`))
    return
  }

  const currentYear = new Date().getFullYear()
  const year = Number.parseInt(Bun.env.YEAR ?? currentYear.toString())

  if (Number.isNaN(year) || year < 2015 || year > currentYear) {
    console.log(
      chalk.red(`📅 Year must be between ${chalk.bold(2015)} and ${chalk.bold(currentYear)}.`),
    )
    return
  }

  console.log('📄 Fetching input...')
  const input = await fetchInput({ day, year }).catch(() => {
    console.log(chalk.red.bold('❌ Fetching input failed, empty file will be created.'))
    return null
  })

  console.log(`📂 Setting up day ${formatDay(day)}...`)

  try {
    await mkdir(dir)
    await Bun.write(new URL(`input.txt`, dir.href), input ?? '')
    await Bun.write(new URL(`index.ts`, dir.href), generateTemplate(day))
    await Bun.write(new URL(`index.test.ts`, dir.href), generateTestTemplate(day))

    console.log(chalk.green.bold(`✅ Day ${formatDay(day)} set up!`))
  } catch (err: any) {
    console.error(chalk.red(err?.message ?? 'Failed to set up day'))
  }
}

const day = Number(Bun.argv[2] ?? '') ?? new Date().getDate()
setupDay(day)