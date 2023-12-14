import { expect, test } from 'bun:test'
import { parse } from './index.ts'

test(`parse`, () => {
  expect(parse('')).toBeTruthy()
})
