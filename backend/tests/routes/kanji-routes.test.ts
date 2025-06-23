// tests/routes/kanjiRoutes.test.ts
// Integration tests for Kanji-related API routes.

import request from 'supertest'
import app from '../../src/index'
import db from '../../src/db/index'
import { KanjiSummary } from '../../src/types/kanji-summary'
import { JlptLevel } from '../../src/types/jlpt-level'
import { KanjiDetails } from '../../src/types/kanji-details'

describe('GET /api/kanji/jlpt-levels', () => {
  it('should return all JLPT levels with status 200', async () => {
    // Reset and seed test data
    await db.none(`TRUNCATE jlpt_levels RESTART IDENTITY CASCADE`)
    await db.none(`
        INSERT INTO jlpt_levels (level, description)
        VALUES ('N5', 'Basic beginner level');
      `)

    const res = await request(app).get('/api/kanji/jlpt-levels')
    expect(res.status).toBe(200)

    // Assert returned data matches inserted record
    const resBody: JlptLevel[] = res.body as JlptLevel[]
    expect(resBody[0].level).toEqual('N5')
    expect(resBody[0].description).toEqual('Basic beginner level')
  })
})

describe('GET /api/kanji/jlpt-levels/5', () => {
  it('should return all kanjis of N5 with status 200', async () => {
    await db.none(`TRUNCATE kanji_entries RESTART IDENTITY CASCADE`)
    await db.none(`
        INSERT INTO kanji_entries (id, character, meanings, onyomi, kunyomi, jlpt_level, stroke_count)
        VALUES ('10', '日', ARRAY['sun'], ARRAY['ニチ'], ARRAY['ひ'], 'N5', 4);
      `)

    const res = await request(app).get('/api/kanji/jlpt-levels/5')
    expect(res.status).toBe(200)

    // Assert the response contains the expected kanji
    const resBody: KanjiSummary[] = res.body as KanjiSummary[]
    expect(resBody.length).toEqual(1)
    expect(resBody[0].character).toEqual('日')
  })

  it('should return empty array if no kanjis exist for N5', async () => {
    await db.none(`TRUNCATE kanji_entries RESTART IDENTITY CASCADE`)

    const res = await request(app).get('/api/kanji/jlpt-levels/5')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body.length).toBe(0)
  })
})

describe('GET /api/kanji/jlpt-levels/whatever', () => {
  it('should return a 400 status for invalid JLPT level', async () => {
    await db.none(`TRUNCATE kanji_entries RESTART IDENTITY CASCADE`)
    await db.none(`
          INSERT INTO kanji_entries (id, character, meanings, onyomi, kunyomi, jlpt_level, stroke_count)
          VALUES ('10', '日', ARRAY['sun'], ARRAY['ニチ'], ARRAY['ひ'], 'N5', 4);
        `)

    const res = await request(app).get('/api/kanji/jlpt-levels/whatever')
    expect(res.status).toBe(400)
  })
})

describe('GET /api/kanji/:id', () => {
  // Seed common data for all tests in this block
  beforeEach(async () => {
    await db.none(`TRUNCATE kanji_entries RESTART IDENTITY CASCADE`)
    await db.none(`
        INSERT INTO kanji_entries (id, character, meanings, onyomi, kunyomi, jlpt_level, stroke_count)
        VALUES ('10', '日', ARRAY['sun'], ARRAY['ニチ'], ARRAY['ひ'], 'N5', 4);
      `)
  })

  it('should return kanji details for id 10 with status 200', async () => {
    const res = await request(app).get('/api/kanji/10')
    expect(res.status).toBe(200)

    const resBody = res.body as KanjiDetails
    expect(resBody.id).toEqual(10)
    expect(resBody.character).toEqual('日')
  })

  it('should return 404 status if kanji does not exist', async () => {
    const res = await request(app).get('/api/kanji/10000')
    expect(res.status).toBe(404)
  })
})

// Clean up DB connection after all tests complete
afterAll(async () => {
  await db.$pool.end()
})
