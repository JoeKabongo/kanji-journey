import db from '../db'
import { KanjiDetails } from '../types/kanji-details'
import { KanjiSummary } from '../types/kanji-summary'
import { JlptLevel } from '../types/jlpt-level'

// Fetches all JLPT levels
export const fetchJlptLevels = async (): Promise<JlptLevel[]> => {
  try {
    const result = await db.query(
      'SELECT * FROM jlpt_levels ORDER BY level ASC'
    )
    return result
  } catch (error) {
    console.error('[fetchJlptLevels] DB query failed:', error)
    throw new Error(`JLPT level fetch from db failed: ${error}`)
  }
}

// Fetches a summary list of kanji (id + character) for a given JLPT level
export const fetchJlptKanjisByLevel = async (
  jlptLevelRaw: string,
  limit?: number
): Promise<KanjiSummary[]> => {
  try {
    const jlptLevel = `N${jlptLevelRaw}` // Format it as 'N5', 'N2', etc.

    const result = await db.query(
      `SELECT id, character FROM kanji_entries where jlpt_level= $1 ${
        limit ? 'LIMIT $2' : ''
      }`,
      limit ? [jlptLevel, limit] : [jlptLevel]
    )
    return result
  } catch (error) {
    console.error('[fetchJlptKanjisByLevel] DB query failed:', error)
    throw new Error(`Kanji list fetch by level from db failed: ${error}`)
  }
}

// Fetches detailed kanji info for a specific ID (assumes ID is numeric)
export const fetchKanjiDetails = async (
  id: string
): Promise<KanjiDetails[]> => {
  try {
    const result = await db.oneOrNone(
      `SELECT * FROM kanji_entries where id= $1`,
      [parseInt(id)]
    )
    return result
  } catch (error) {
    console.error(`[fetchKanjiDetails] Failed to fetch kanji with ID: ${id}`)
    console.error(error)
    throw new Error(`Kanji details fetch from db failed: ${error}`)
  }
}
