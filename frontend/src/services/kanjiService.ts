import axios from 'axios'
import { JlptLevel } from '../../../shared/types/jlpt-level'
import { KanjiSummary } from '../../../shared/types/kanji-summary'

const API_END_POINT = 'http://localhost:4000/api'

export const fetchJlptLevels = async (): Promise<JlptLevel[]> => {
  const response = await axios.get<JlptLevel[]>(
    `${API_END_POINT}/kanji/jlpt-levels`
  )
  return response.data
}

export const fetchKanjisByLevel = async (
  level: string
): Promise<KanjiSummary[]> => {
  const response = await axios.get<KanjiSummary[]>(
    `${API_END_POINT}/kanji/jlpt-levels/${level}`
  )
  return response.data
}
