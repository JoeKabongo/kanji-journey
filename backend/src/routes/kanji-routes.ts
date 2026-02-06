import { Router } from 'express'
import {
  getJlptLevels,
  getKanjiByJlptLevel,
  getKanjiDetails,
  findKanji,
} from '../controllers/kanji-controller'

const router = Router()

router.get('/jlpt-levels', getJlptLevels)
router.get('/jlpt-levels/:level', getKanjiByJlptLevel)
router.get('/:kanjiId', getKanjiDetails)
router.get('/search/:character', findKanji)

export default router
