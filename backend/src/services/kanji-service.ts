import db from '../db'
import { JlptLevel } from '../types/kanji-types'

export const fetchJlptLevels = async (): Promise<JlptLevel[]> => {
  const result = await db.query('SELECT * FROM jlpt_levels ORDER BY level ASC')
  return result
}
