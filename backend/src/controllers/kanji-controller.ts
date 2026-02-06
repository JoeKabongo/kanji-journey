import { Request, Response } from 'express'
import {
  fetchJlptLevels,
  fetchJlptKanjisByLevel,
  fetchKanjiDetails,
  searchKanji,
} from '../services/kanji-service'

/**
 * Controller for GET /api/kanji/jlpt-levels
 * Fetches and returns all available JLPT levels.
 */
export const getJlptLevels = async (_: Request, res: Response) => {
  try {
    const levels = await fetchJlptLevels()
    res.status(200).json(levels)
  } catch (error) {
    console.error('[getJlptLevels] Failed to fetch levels:', error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

/**
 * Controller for GET /api/kanji/jlpt-levels/:level
 * Fetches and returns a list of kanji for a specific JLPT level.
 * An optional 'limit' can be provided as a query parameter.
 */
export const getKanjiByJlptLevel = async (req: Request, res: Response) => {
  const { level } = req.params
  const { limit } = req.query

  try {
    // Safely parse the 'limit' query parameter into a number if it exists.
    const parsedLimit = limit ? parseInt(limit as string, 10) : undefined
    const kanjis = await fetchJlptKanjisByLevel(level, parsedLimit)
    res.status(200).json(kanjis)
  } catch (error) {
    console.error(
      `[getKanjiByJlptLevel] Failed to fetch kanji for level ${level}:`,
      error,
    )
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

/**
 * Controller for GET /api/kanji/:kanjiId
 * Fetches and returns the full details for a single kanji by its ID.
 */
export const getKanjiDetails = async (req: Request, res: Response) => {
  const { kanjiId } = req.params
  try {
    const kanjiDetail = await fetchKanjiDetails(kanjiId)

    if (kanjiDetail === null) {
      res.status(404).json({ message: `Kanji with id ${kanjiId} not found.` })
      return
    }

    res.status(200).json(kanjiDetail)
  } catch (error) {
    console.error(
      `[getKanjiDetails] Failed to fetch details for kanji ID ${kanjiId}:`,
      error,
    )
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

export const findKanji = async (req: Request, res: Response) => {
  const { character } = req.params

  try {
    const results = await searchKanji(character)
    res.status(200).json(results)
  } catch (error) {
    console.error('[findKanji] Failed to search kanji:', error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}
