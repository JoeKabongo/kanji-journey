import db from '../src/db'
import fetch from 'node-fetch'

interface KanjiDetails {
  meanings: string[]
  on_readings: string[]
  kun_readings: string[]
  jlpt: number
  stroke_count: number
}

interface JishoEntry {
  japanese: { word: string }[]
}

interface JishoResponse {
  data: JishoEntry[]
}

// Utility: simple sleep function to slow down requests and avoid rate limits
const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms))

/**
 * Fetches a list of kanji characters for a specific JLPT level from kanjiapi.dev
 */
const fetchJlptLevelKanjiList = async (
  jlptLevel: number
): Promise<string[]> => {
  try {
    const res = await fetch(`https://kanjiapi.dev/v1/kanji/jlpt-${jlptLevel}`)
    if (!res.ok) {
      throw new Error(`Failed to fetch kanji list for JLPT N${jlptLevel}`)
    }

    const data = await res.json()
    if (!Array.isArray(data)) {
      throw new Error('Unexpected response format from kanjiapi')
    }

    return data as string[]
  } catch (error) {
    throw new Error(`Kanji list fetch error: ${error}`)
  }
}

/**
 * Fetches detailed information for a single kanji (meanings, readings, strokes, etc.)
 */
const fetchKanjiDetails = async (kanji: string): Promise<KanjiDetails> => {
  try {
    const res = await fetch(`https://kanjiapi.dev/v1/kanji/${kanji}`)
    if (!res.ok) {
      throw new Error(`Failed to fetch details for kanji ${kanji}`)
    }
    return (await res.json()) as KanjiDetails
  } catch (error) {
    throw new Error(`Kanji details fetch error for ${kanji}: ${error}`)
  }
}

/**
 * Fetches example word usages for a given kanji from Jisho.org
 * Note: Jisho requires a browser-like User-Agent header to avoid 403s
 */
const fetchKanjiWordExamples = async (kanji: string): Promise<string[]> => {
  try {
    const res = await fetch(
      `https://jisho.org/api/v1/search/words?keyword=${kanji}`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
          Accept: 'application/json',
        },
      }
    )
    if (!res.ok) {
      throw new Error(`Failed to fetch examples for ${kanji}`)
    }

    const resData = (await res.json()) as JishoResponse
    return resData.data.map((entry) => entry.japanese[0].word)
  } catch (error) {
    console.warn(`⚠️ Skipping examples for ${kanji}: ${error}`)
    return []
  }
}

/**
 * Main function to fetch JLPT kanji, enrich with API data, and insert into Postgres
 */
const importKanjiData = async () => {
  try {
    const levels = [5, 4, 3, 2, 1]

    for (var jlptLevel of levels) {
      console.log(`⬇️ Importing JLPT N${jlptLevel}...`)
      const kanjiList: string[] = await fetchJlptLevelKanjiList(jlptLevel)

      for (const kanji of kanjiList) {
        const kanjiDetails = await fetchKanjiDetails(kanji)
        const wordExamples = await fetchKanjiWordExamples(kanji)

        await db.none(
          ` 
                  INSERT INTO kanji_entries (character, meanings, onyomi, kunyomi, jlpt_level, stroke_count, examples, created_at, updated_at)
                  VALUES
                    ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
          [
            kanji,
            kanjiDetails.meanings,
            kanjiDetails.on_readings,
            kanjiDetails.kun_readings,
            `N${kanjiDetails.jlpt}`,
            kanjiDetails.stroke_count,
            JSON.stringify(wordExamples),
          ]
        )
        await sleep(200) // prevent API spam
      }
      console.log(`✅ Import complete for N${jlptLevel}.`)
    }
  } catch (error) {
    console.error('❌ Import failed:', error)
  }
}

// Kick off the import when script is run
importKanjiData()
