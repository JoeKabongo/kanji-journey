import db from '../db'
import { KanjiDetails } from '@shared/types/kanji-details'
import { KanjiSummary } from '@shared/types/kanji-summary'
import { JlptLevel } from '@shared/types/jlpt-level'

/**
 * Fetches the list of all available JLPT levels, ordered by level.
 * @returns A promise that resolves to an array of JlptLevel objects.
 */
export const fetchJlptLevels = async (): Promise<JlptLevel[]> => {
  try {
    const result = await db.query(
      'SELECT * FROM jlpt_levels ORDER BY level ASC',
    )
    return result
  } catch (error) {
    console.error('[fetchJlptLevels] DB query failed:', error)
    throw new Error(`JLPT level fetch from db failed.`)
  }
}

/**
 * Fetches a summary list of kanji for a given JLPT level.
 * @param {string} jlptLevel - The level to filter by (e.g., "N5").
 * @param {number} [limit] - An optional limit for the number of results.
 * @returns A promise that resolves to an array of KanjiSummary objects.
 */
export const fetchJlptKanjisByLevel = async (
  jlptLevel: string,
  limit?: number,
): Promise<KanjiSummary[]> => {
  try {
    const query = `
      SELECT id, character FROM kanji_entries
      WHERE jlpt_level = $1
      ${limit ? 'LIMIT $2' : ''}
    `
    const params = limit ? [jlptLevel, limit] : [jlptLevel]

    const result = await db.query(query, params)
    return result
  } catch (error) {
    console.error('[fetchJlptKanjisByLevel] DB query failed:', error)
    throw new Error(`Kanji list fetch by level from db failed.`)
  }
}

/**
 * Fetches the full details for a single kanji by its numeric ID.
 * @param {string} id - The ID of the kanji to fetch.
 * @returns A promise that resolves to a KanjiDetails object, or null if not found.
 */
export const fetchKanjiDetails = async (
  id: string,
): Promise<KanjiDetails | null> => {
  try {
    const result = await db.oneOrNone(
      `SELECT * FROM kanji_entries WHERE id = $1`,
      [parseInt(id, 10)], // Ensure the ID is treated as a number.
    )
    return result
  } catch (error) {
    console.error(
      `[fetchKanjiDetails] Failed to fetch kanji with ID ${id}:`,
      error,
    )
    throw new Error(`Kanji details fetch from db failed.`)
  }
}

/**
 * Searches for a kanji by its character.
 * @param {string} character - The kanji character to search for.
 * @returns A promise that resolves to a KanjiSummary object if found, or null if not found.
 */
export const searchKanji = async (
  character: string,
): Promise<KanjiSummary | null> => {
  try {
    const result = await db.oneOrNone(
      `SELECT id, character FROM kanji_entries WHERE character= $1`,
      [character],
    )
    return result
  } catch (error) {
    console.error(
      `[searchKanji] Failed to search kanji with character "${character}":`,
      error,
    )
    throw new Error(`Kanji search in db failed.`)
  }
}
