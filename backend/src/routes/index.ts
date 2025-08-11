import { Router } from 'express'
import kanjiRoutes from './kanji-routes'
import authRoutes from './auth-routes'

const router = Router()

router.use('/kanji', kanjiRoutes)
router.use('/auth', authRoutes)
export default router
