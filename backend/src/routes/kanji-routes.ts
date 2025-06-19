import { Router } from 'express'
import { getJlptLevels } from '../controllers/kanji-controller'

const router = Router()

router.get('/jlpt-levels', getJlptLevels)

export default router
