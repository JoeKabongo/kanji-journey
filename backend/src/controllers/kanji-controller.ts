import { Request, Response } from 'express'
import {
  fetchJlptLevels,
  fetchJlptKanjisByLevel,
  fetchKanjiDetails,
} from '../services/kanji-service'
import { JlptLevel } from '../types/jlpt-level'

// Controller to return all JLPT levels from the database
export const getJlptLevels = async (req: Request, res: Response) => {
  try {
    const levels: JlptLevel[] = await fetchJlptLevels()
    res.json(levels)
  } catch (error) {
    console.error(error)
    res.status(500).send(`Server error${error}`)
  }
}

// Controller to return kanji summaries by JLPT level (e.g., N5)
export const getKanjiByJlptLevel = async (req: Request, res: Response) => {
  const { level } = req.params
  const { limit } = req.query

  try {
    const parsedLimit = limit ? parseInt(limit as string, 10) : undefined

    const kanjis = await fetchJlptKanjisByLevel(level, parsedLimit)
    res.json(kanjis)
  } catch (error) {
    console.error(error)
    res.status(500).send(`Server error${error}`)
  }
}

// Controller to return full kanji detail by ID
export const getKanjiDetails = async (req: Request, res: Response) => {
  const { kanjiId } = req.params
  try {
    const kanjiDetail = await fetchKanjiDetails(kanjiId)
    res.json(kanjiDetail)
  } catch (error) {
    console.error(error)
    res.status(500).send(`Server error${error}`)
  }
}
