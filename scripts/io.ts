import { Submissions } from '~types'

const submissionsPath = '.submissions.json'
export const readSubmissionsFile = async (): Promise<Submissions> => {
  const file = Bun.file(submissionsPath)
  if (await file.exists()) {
    return JSON.parse(await file.text())
  }

  return []
}

export const writeSubmissionsFile = async (submissions: Submissions) => {
  return await Bun.write(submissionsPath, JSON.stringify(submissions, null, 2))
}
