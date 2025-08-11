import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { fetchJlptLevels, fetchKanjisByLevel } from '../services/kanjiService'
import { useQuery } from '@tanstack/react-query'
import { useParams, useNavigate } from 'react-router'
import { useEffect } from 'react'

/**
 * Renders a page displaying a list of Kanji characters filtered by their
 * JLPT level. The level is controlled by a URL parameter and a dropdown menu.
 */
const KanjiListPage = () => {
  // Debug log to confirm component mount. Can be removed in production.
  useEffect(() => {
    console.log('[KanjiListPage mounted]')
  }, [])

  // Get the current JLPT level from the URL (e.g., /kanjis/N5)
  const { jlptLevel } = useParams()
  const navigate = useNavigate()

  // Fetch the list of all available JLPT levels for the dropdown.
  const { status: jlptLevelStatus, data: jlptLevels } = useQuery({
    queryKey: ['jlptLevels'],
    queryFn: fetchJlptLevels,
  })

  // Fetch the kanjis for the currently selected JLPT level.
  // This query is only enabled when a `jlptLevel` parameter exists in the URL.
  const { status: kanjisListStatus, data: kanjiList } = useQuery({
    enabled: Boolean(jlptLevel),
    queryKey: ['kanjis', jlptLevel],
    queryFn: () => fetchKanjisByLevel(jlptLevel!),
  })

  /**
   * Navigates to the new URL when the user selects a different level
   * from the dropdown, triggering a data refetch for the new level.
   */
  const handleJlptLevelChange = (event: SelectChangeEvent) => {
    const selected = event.target.value as string
    navigate(`/kanjis/${selected}`)
  }

  if (jlptLevelStatus === 'pending') return <h1> Loading...</h1>
  if (jlptLevelStatus === 'error' || kanjisListStatus === 'error')
    return <h1> Something went wrong </h1>

  return (
    <div className="pl-20 pr-20">
      <h1 className="font-bold text-4xl pt-5 pb-5"> Kanji by JLPT Level </h1>
      <Box sx={{ minWidth: 200, maxWidth: 400 }}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label"> Level</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={jlptLevel}
            label="Jlpt level"
            onChange={handleJlptLevelChange}
          >
            {jlptLevels.map((jlptLevel) => (
              <MenuItem value={jlptLevel.level}>{jlptLevel.level}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {kanjiList !== undefined
        ? kanjiList.map((kanji, index) => <p key={index}> {kanji.character}</p>)
        : null}
    </div>
  )
}

export default KanjiListPage
