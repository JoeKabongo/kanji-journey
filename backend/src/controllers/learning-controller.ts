import { Request, Response } from 'express'
import { getLearningIndex } from '../services/learning-service'

/**
 * Controller to handle Google Sign-In. It verifies the Google ID token,
 * finds or creates a user, and returns session tokens.
 */
export const getIndex = async (req: Request, res: Response) => {
  res.json(await getLearningIndex())
}
