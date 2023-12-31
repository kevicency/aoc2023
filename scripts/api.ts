import chalk from 'chalk'
import { JSDOM } from 'jsdom'

const headers = {
  Cookie: `session=${Bun.env.SESSION}`,
  'User-Agent': 'github.com/kevicency/aoc2023 by kev.mees@gmail.com',
}

const API_URL = Bun.env.AOC_API ?? 'https://adventofcode.com'

export const fetchInput = async ({ day, year }: { day: number; year?: number }) => {
  if (!year) {
    year = new Date().getFullYear()
  }
  const response = await fetch(`${API_URL}/${year}/day/${day}/input`, {
    headers,
  })
  return response.ok ? await response.text() : Promise.reject(response)
}

const strToNum = (time: string) => {
  const entries: { [key: string]: number } = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
    ten: 10,
  }

  return entries[time] || NaN
}

let canSubmit = true
let delayStart = 0
let delayAmount = 0

export enum Status {
  SOLVED,
  WRONG,
  ERROR,
}

const timeToReadable = (d: number, h: number, m: number, s: number) => {
  return (
    (d !== 0 ? `${d}d ` : '') +
    (h !== 0 ? `${h}h ` : '') +
    (m !== 0 ? `${m}m ` : '') +
    (s !== 0 ? `${s}s ` : '')
  )
}

const msToReadable = (ms: number) => {
  const msSecond = 1000
  const msMinute = 60 * msSecond
  const msHour = 60 * msMinute
  const msDay = 24 * msHour

  const d = Math.floor(ms / msDay)
  const h = Math.floor((ms - msDay * d) / msHour)
  const m = Math.floor((ms - msDay * d - msHour * h) / msMinute)
  const s = Math.floor((ms - msDay * d - msHour * h - msMinute * m) / msSecond)

  return timeToReadable(d, h, m, s)
}

const handleErrors = (e: Error) => {
  if (e.message === '400' || e.message === '500') {
    console.log(
      chalk.red('INVALID SESSION KEY\n\n') +
        'Please make sure that the session key in the .env file is correct.\n' +
        "You can find your session key in the 'session' cookie at:\n" +
        'https://adventofcode.com\n\n' +
        chalk.bold('Restart the script after changing the .env file.\n'),
    )
  } else if (e.message.startsWith('5')) {
    console.log(chalk.red('SERVER ERROR'))
  } else if (e.message === '404') {
    console.log(chalk.yellow('CHALLENGE NOT YET AVAILABLE'))
  } else {
    console.log(
      chalk.red(
        "UNEXPECTED ERROR\nPlease check your internet connection.\n\nIf you think it's a bug, create an issue on github.\nHere are some details to include:\n",
      ),
    )
    console.log(e)
  }

  return Status['ERROR']
}

export const submitSolution = (
  year: number,
  day: number,
  part: 1 | 2,
  solution: number | string,
): Promise<Status> => {
  if (!canSubmit) {
    const now = Date.now()
    const remainingMs = delayAmount - (now - delayStart)

    if (remainingMs <= 0) {
      canSubmit = true
    } else {
      console.log(chalk.red(`You have to wait: ${msToReadable(remainingMs)}`))
      return Promise.resolve(Status['ERROR'])
    }
  }

  return fetch(`${API_URL}/${year}/day/${day}/answer`, {
    headers: {
      ...headers,
      'content-type': 'application/x-www-form-urlencoded',
    },
    method: 'POST',
    body: `level=${part}&answer=${solution}`,
  })
    .then((res) => {
      if (res.status !== 200) {
        throw new Error(String(res.status))
      }

      return res.text()
    })
    .then((body) => {
      const $main = new JSDOM(body).window.document.querySelector('main')

      let status = Status['ERROR']

      const info =
        $main !== null
          ? ($main.textContent as string).replace(/\[.*\]/, '').trim()
          : "Can't find the main element"

      if (info.includes("That's the right answer")) {
        console.log(`Status`, chalk.green(`PART ${part} SOLVED!`))
        return Status['SOLVED']
      } else if (info.includes("That's not the right answer")) {
        console.log('Status:', chalk.red('WRONG ANSWER'))
        console.log(`\n${info}\n`)
        status = Status['WRONG']
      } else if (info.includes('You gave an answer too recently')) {
        console.log('Status:', chalk.yellow('TO SOON'))
      } else if (info.includes("You don't seem to be solving the right level")) {
        console.log('Status:', chalk.yellow('ALREADY COMPLETED or LOCKED'))
        return Status['SOLVED']
      } else {
        console.log('Status:', chalk.red('UNKNOWN RESPONSE\n'))
        console.log(`\n${info}\n`)
      }

      const waitStr = info.match(
        /(one|two|three|four|five|six|seven|eight|nine|ten) (second|minute|hour|day)/,
      )
      const waitNum = info.match(/\d+\s*(s|m|h|d)/g)

      if (waitStr !== null || waitNum !== null) {
        const waitTime: { [key: string]: number } = {
          s: 0,
          m: 0,
          h: 0,
          d: 0,
        }

        if (waitStr !== null) {
          const [_, time, unit] = waitStr
          waitTime[unit[0]] = strToNum(time)
        } else if (waitNum !== null) {
          waitNum.forEach((x) => {
            waitTime[x.slice(-1)] = Number(x.slice(0, -1))
          })
        }

        canSubmit = false
        delayStart = Date.now()
        delayAmount =
          (waitTime.d * 24 * 60 * 60 + waitTime.h * 60 * 60 + waitTime.m * 60 + waitTime.s) * 1000

        const delayStr = timeToReadable(waitTime.d, waitTime.h, waitTime.m, waitTime.s)

        console.log(`Next request possible in: ${delayStr}`)
      }

      return status
    })
    .catch(handleErrors)
}
