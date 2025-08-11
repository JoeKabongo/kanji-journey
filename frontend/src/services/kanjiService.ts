import apiClient from './apiClient' // Import the centralized instance
import { JlptLevel } from '../../../shared/types/jlpt-level'
import { KanjiSummary } from '../../../shared/types/kanji-summary'

/**
 * Fetches the list of all available JLPT levels.
 */
export const fetchJlptLevels = async (): Promise<JlptLevel[]> => {
  // No need to construct the full URL anymore
  const response = await apiClient.get<JlptLevel[]>('/kanji/jlpt-levels')
  return response.data
}

/**
 * Fetches all Kanji characters for a specific JLPT level.
 */
export const fetchKanjisByLevel = async (
  level: string
): Promise<KanjiSummary[]> => {
  const response = await apiClient.get<KanjiSummary[]>(
    `/kanji/jlpt-levels/${level}`
  )
  return response.data
}
