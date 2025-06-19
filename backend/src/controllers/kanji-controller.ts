import { Request, Response } from 'express'
import { fetchJlptLevels } from '../services/kanji-service'
import { JlptLevel } from '../types/kanji-types'

export const getJlptLevels = async (req: Request, res: Response) => {
  try {
    const levels: JlptLevel[] = await fetchJlptLevels()
    res.json(levels)
  } catch (err) {
    console.error(err)
    res.status(500).send('Server error')
  }
}
