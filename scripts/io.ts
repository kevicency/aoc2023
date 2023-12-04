import { Submissions } from '~types'
import { formatDayName, generateChart, renderDayBadges, renderResults } from './utils.ts'
import { range } from 'ramda'

const submissionsPath = '.submissions.json'
const readmePath = 'README.md'

export const readSubmissionsFile = async (): Promise<Submissions> => {
  const file = Bun.file(submissionsPath)
  let submissions: Submissions = []
  if (await file.exists()) {
    submissions = JSON.parse(await file.text())
  }

  return range(0, 25).map((i) => ({
    part1: { solved: false, result: null, time: 0, attempts: [] },
    part2: { solved: false, result: null, time: 0, attempts: [] },
    ...submissions[i],
  }))
}

export const writeSubmissionsFile = async (submissions: Submissions) => {
  return await Bun.write(submissionsPath, JSON.stringify(submissions, null, 2))
}

export const readReadmeFile = async (): Promise<string> => {
  const file = Bun.file(readmePath)
  if (!(await file.exists())) {
    throw new Error('README.md does not exist')
  }

  return await file.text()
}

export const updateReadmeFile = async () => {
  const readme = await readReadmeFile()
  const submissions = await readSubmissionsFile()
  const badges = renderDayBadges(submissions)
  const results = renderResults(submissions)

  await generateChart()

  const updatedReadme = readme
    .replace(
      /<!--SOLUTIONS-->(.|\n|\r)+<!--\/SOLUTIONS-->/,
      `<!--SOLUTIONS-->\n\n${badges}\n\n<!--/SOLUTIONS-->`,
    )
    .replace(
      /<!--RESULTS-->(.|\n|\r)+<!--\/RESULTS-->/,
      `<!--RESULTS-->\n\n${results}\n\n<!--/RESULTS-->`,
    )

  await Bun.write(readmePath, updatedReadme)
}

export const readDayFile = async (day: number) => {
  const file = Bun.file(`${formatDayName(day)}/index.ts`)

  if (await file.exists()) {
    return await file.text()
  }

  return ''
}
