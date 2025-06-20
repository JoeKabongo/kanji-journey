import { Router } from 'express'
import {
  getJlptLevels,
  getKanjiByJlptLevel,
  getKanjiDetails,
} from '../controllers/kanji-controller'

const router = Router()

router.get('/jlpt-levels', getJlptLevels)
router.get('/jlpt-levels/:level', getKanjiByJlptLevel)
router.get('/:kanjiId', getKanjiDetails)

export default router
