import { Router } from 'express'
import kanjiRoutes from './kanji-routes'
import authRoutes from './auth-routes'
import learningRoutes from './learning-routes'

const router = Router()

router.use('/kanji', kanjiRoutes)
router.use('/auth', authRoutes)
router.use('/learning', learningRoutes)

export default router
