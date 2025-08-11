import { Router } from 'express'
import { authenticateWithGoogle } from '../controllers/auth-controller'

const router = Router()

router.post('/google-auth', authenticateWithGoogle)

export default router
