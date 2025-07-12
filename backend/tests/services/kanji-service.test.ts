// tests/services/kanjiService.test.ts
// Unit tests for kanji-service

import * as service from '../../src/services/kanji-service'
import db from '../../src/db'
import { KanjiSummary } from '@shared/types/kanji-summary'

describe('Kanji Service', () => {
  // Reset and seed JLPT levels before each test group
  beforeEach(async () => {
    await db.none(
      `TRUNCATE kanji_entries, jlpt_levels RESTART IDENTITY CASCADE`
    )
    await db.none(`
      INSERT INTO jlpt_levels (level, description)
      VALUES ('N5', 'Beginner level')
    `)
  })

  // Test for fetchJlptLevels
  it('fetchJlptLevels should return JLPT levels from DB', async () => {
    const result = await service.fetchJlptLevels()
    expect(result.length).toBe(1)
    expect(result[0].level).toBe('N5')
  })

  describe('fetchJlptKanjisByLevel', () => {
    // Seed kanji entries before each test in this group
    beforeEach(async () => {
      await db.none(`
        INSERT INTO kanji_entries (id, character, meanings, onyomi, kunyomi, jlpt_level, stroke_count)
        VALUES ('10', '日', ARRAY['sun'], ARRAY['ニチ'], ARRAY['ひ'], 'N5', 4);
      `)
      await db.none(`
        INSERT INTO kanji_entries (id, character, meanings, onyomi, kunyomi, jlpt_level, stroke_count)
        VALUES ('12', '昨', ARRAY['yesterday'], ARRAY['サク'], ARRAY['ひ'], 'N5', 9);
      `)
    })

    // Test with limit 2: should return both kanji
    it('fetchJlptKanjisByLevel should return kanji list for jlpt level', async () => {
      const result = await service.fetchJlptKanjisByLevel('N5', 2)
      expect(result.length).toBe(2)
      expect(result[0].character).toEqual('日')
      expect(result[1].character).toEqual('昨')
    })

    // Test with limit 1: should return only 1 kanji
    it('fetchJlptKanjisByLevel should return kanji list for jlpt level, limit 1', async () => {
      const result = await service.fetchJlptKanjisByLevel('N5', 1)
      expect(result.length).toBe(1)
      expect(result[0].character).toEqual('日')
    })

    // Test with level that has no kanji
    it('fetchJlptKanjisByLevel no kanji found, return empty', async () => {
      const result = (await service.fetchJlptKanjisByLevel(
        '1',
        1
      )) as KanjiSummary[]
      expect(result.length).toBe(0)
    })
  })

  describe('fetchKanjiDetails', () => {
    // Seed a single kanji before each test
    beforeEach(async () => {
      await db.none(`
        INSERT INTO kanji_entries (id, character, meanings, onyomi, kunyomi, jlpt_level, stroke_count)
        VALUES ('10', '日', ARRAY['sun'], ARRAY['ニチ'], ARRAY['ひ'], 'N5', 4);
      `)
    })

    // Should return full kanji detail
    it('fetchKanjiDetails find and return kanjiDetails', async () => {
      const result = await service.fetchKanjiDetails('10')
      expect(result!.character).toEqual('日')
      expect(result!.jlpt_level).toEqual('N5')
      expect(result!.meanings).toEqual(['sun'])
    })

    // Should return null if not found
    it('fetchKanjiDetails kanji not found', async () => {
      const result = await service.fetchKanjiDetails('100')
      expect(result).toBeNull()
    })
  })
})

// Clean up DB connection after all tests complete
afterAll(async () => {
  await db.$pool.end()
})
