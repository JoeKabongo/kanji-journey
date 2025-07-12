import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { fetchJlptLevels, fetchKanjisByLevel } from '../services/kanjiService'
import { useQuery } from '@tanstack/react-query'
import { useParams, useNavigate } from 'react-router'
import { useEffect } from 'react'

const KanjiListPage = () => {
  useEffect(() => {
    console.log('[KanjiListPage mounted]')
  }, [])

  const { jlptLevel } = useParams()
  const navigate = useNavigate()

  const { status: jlptLevelStatus, data: jlptLevels } = useQuery({
    queryKey: ['jlptLevels'],
    queryFn: fetchJlptLevels,
  })

  const { status: kanjisListStatus, data: kanjiList } = useQuery({
    enabled: Boolean(jlptLevel),
    queryKey: ['kanjis', jlptLevel],
    queryFn: () => fetchKanjisByLevel(jlptLevel!),
  })

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
