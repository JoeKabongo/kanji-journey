import KanjiLevelCard from '../components/kanji/KanjiLevelCard'
import { fetchJlptLevels } from '../services/kanjiService'
import { useQuery } from '@tanstack/react-query'

const HomePage = () => {
  const {
    status,
    error,
    data: jlptLevels,
  } = useQuery({
    queryKey: ['jlptLevels'],
    queryFn: fetchJlptLevels,
  })

  if (status === 'pending') return <h1> Loading...</h1>
  if (status === 'error') return <h1> {JSON.stringify(error)}</h1>

  return (
    <div className="pl-20 pr-20">
      <h1 className="font-bold text-4xl pt-5 pb-5"> Welcome back </h1>
      <p>
        Continue your journey to mastering Japanese Kanji. Select a level to
        resume your studies. 頑張りましょう!!
      </p>

      <section className="pt-5">
        <h1 className="font-bold text-2xl"> JLPT Levels </h1>
        <div className="flex flex-wrap gap-10 align-center justify-center">
          {jlptLevels.map((level, index) => (
            <KanjiLevelCard index={index} jlptLevel={level} key={level.id} />
          ))}
        </div>
      </section>
    </div>
  )
}

export default HomePage
