import { Router } from 'express'
import kanjiRoutes from './kanji-routes'

const router = Router()

router.use('/kanji', kanjiRoutes)

export default router
