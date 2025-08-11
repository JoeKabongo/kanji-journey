import { JlptLevel } from '../../../../shared/types/jlpt-level'
import jlptImage from '../../assets/jlptImage.png'
import jlptImage1 from '../../assets/jlptImage2.png'
import { useNavigate } from 'react-router'

/**
 * @interface ComponentProps
 * Defines the props required by the KanjiLevelCard component.
 * @param {number} index - The display order of the card, used to alternate images.
 * @param {JlptLevel} jlptLevel - The JLPT level data to display.
 */
interface ComponentProps {
  index: number
  jlptLevel: JlptLevel
}

/**
 * Renders a clickable card representing a single JLPT level.
 * Navigates to the corresponding kanji list page when clicked.
 */
const KanjiLevelCard = ({ index, jlptLevel }: ComponentProps) => {
  const navigate = useNavigate()
  return (
    <div
      onClick={() => navigate(`/kanjis/${jlptLevel.level}`)}
      className="cursor-pointer p-5 hover:bg-gray-200"
    >
      <img src={index % 2 == 0 ? jlptImage : jlptImage1} />
      <p className="mt-2 font-bold"> {jlptLevel.level} </p>
      <span> 0% complete</span>
    </div>
  )
}

export default KanjiLevelCard
