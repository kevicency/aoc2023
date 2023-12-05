export type Example = { input: string; expected: string | number }
export type Examples = Example[]

export type Solution<TParse extends (input: string) => any> = (input: ReturnType<TParse>) => any

export type Day =
  | 'day-01'
  | 'day-02'
  | 'day-03'
  | 'day-04'
  | 'day-05'
  | 'day-06'
  | 'day-07'
  | 'day-08'
  | 'day-09'
  | 'day-10'
  | 'day-11'
  | 'day-12'
  | 'day-13'
  | 'day-14'
  | 'day-15'
  | 'day-16'
  | 'day-17'
  | 'day-18'
  | 'day-19'
  | 'day-20'
  | 'day-21'
  | 'day-22'
  | 'day-23'
  | 'day-24'
  | 'day-25'

export type Submission = {
  solved: boolean
  result: string | number
  attempts: (string | number)[]
  time: number
}
export type Submissions = Array<{
  part1: Submission
  part2: Submission
}>
