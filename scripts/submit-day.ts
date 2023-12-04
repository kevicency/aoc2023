import chalk from 'chalk'
import { aocYear, formatDay } from './utils.ts'
import { runDay, RunResult } from './run-day.ts'
import { readSubmissionsFile, writeSubmissionsFile } from './io.ts'
import { Status, submitSolution } from './api.ts'
import { Submission, Submissions } from '~types'

const submitPart = async (
  part: 1 | 2,
  submission: Submission,
  run: RunResult = { success: false, result: null, performance: 0 },
) => {
  if (submission.solved) {
    console.log(chalk.green(`Part already solved!`))
    return submission
  }

  if (!run.success) {
    console.log(chalk.yellow(`Result is not valid, skipping.`))
    return submission
  }

  if (submission.attempts.includes(run.result)) {
    console.log(chalk.yellow('Already tried this result, skipping.'))
    return submission
  }

  const status = await submitSolution(aocYear(), day, part, run.result)

  console.log()

  if (status === Status['SOLVED']) {
    submission.solved = true
    submission.result = run.result
    submission.time = run.performance
  }

  if (status === Status['WRONG']) {
    submission.attempts.push(run.result)
  }

  return submission
}

const submitDay = async (day: number) => {
  const submissions = await readSubmissionsFile()
  const daySubmission: Submissions[number] = submissions[day] ?? {
    part1: { solved: false, result: null, time: 0, attempts: [] },
    part2: { solved: false, result: null, time: 0, attempts: [] },
  }

  if (daySubmission.part1.solved && daySubmission.part2.solved) {
    console.log(chalk.green(`Day ${formatDay(day)} already solved!`))
    return
  }

  const skipPart1 = daySubmission.part1.solved

  if (!skipPart1) {
    const runResult = await runDay(day, { isDevMode: true, isSubmit: true, skipPart2: true })
    await submitPart(1, daySubmission.part1, runResult?.part1)
  }

  if (daySubmission.part1.solved) {
    const runResult = await runDay(day, { isDevMode: true, isSubmit: true, skipPart1: true })
    await submitPart(2, daySubmission.part2, runResult?.part2 ?? undefined)
  }

  submissions[day] = daySubmission
  await writeSubmissionsFile(submissions)
}

const day = Number(Bun.argv[2] ?? '')
// const isDevMode = Bun.argv[3] === '--dev'

await submitDay(day)
