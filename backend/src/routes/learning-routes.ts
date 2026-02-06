import { Router } from 'express'
import { getIndex } from '../controllers/learning-controller'

const router = Router()

router.get('/', getIndex)

export default router
