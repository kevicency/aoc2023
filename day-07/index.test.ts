import { expect, test } from 'bun:test'
import { cardsToType, cardsToValue } from './index.ts'

test(`cardsToType`, () => {
  expect(cardsToType('AAAAA')).toBe('5')
  expect(cardsToType('AAAAK')).toBe('4')
  expect(cardsToType('KAAAA')).toBe('4')
  expect(cardsToType('KKAAA')).toBe('F')
  expect(cardsToType('KKKAA')).toBe('F')
  expect(cardsToType('AAAKQ')).toBe('3')
  expect(cardsToType('AAKKQ')).toBe('2')
  expect(cardsToType('AAKQJ')).toBe('1')
  expect(cardsToType('AKQJT')).toBe('H')

  expect(cardsToType('T55J5', true)).toBe('4')
  expect(cardsToType('KTJJT', true)).toBe('4')
  expect(cardsToType('QQQJA', true)).toBe('4')
  expect(cardsToType('JJJJJ', true)).toBe('5')
})

test(`cardsToValue`, () => {
  expect(cardsToValue('AAAAA')).toBe('6ccccc')
  expect(cardsToValue('KKKKK')).toBe('6bbbbb')

  expect(
    ['KKKKK', 'QQ2JJ', 'AAAAA']
      .map((c) => cardsToValue(c))
      .sort()
      .reverse(),
  ).toEqual(['6ccccc', '6bbbbb', '2aa099'])

  expect(['T55J5', 'KTJJT', 'QQQJA'].map((c) => cardsToValue(c, true))).toEqual([
    '594404',
    '5b9009',
    '5aaa0c',
  ])
  expect(['594404', '5b9009', '5aaa0c'].sort()).toEqual(['594404', '5aaa0c', '5b9009'])
})
