import { Request, Response } from 'express'
import { OAuth2Client } from 'google-auth-library'
import { authenticateViaGoogle } from '../services/auth-service'

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

/**
 * Controller to handle Google Sign-In. It verifies the Google ID token,
 * finds or creates a user, and returns session tokens.
 */
export const authenticateWithGoogle = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res
        .status(401)
        .json({ message: 'Authorization header is missing or invalid.' })
      return
    }

    const token = authHeader.split(' ')[1]

    // Verify the token's integrity with Google's servers.
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    })

    const payload = ticket.getPayload()

    // Ensure the token payload is valid.
    if (!payload || !payload.sub) {
      res.status(401).json({ message: 'Invalid token payload.' })
      return
    }

    // Pass the verified user details to the service layer to handle database logic.
    const authResult = await authenticateViaGoogle(payload)

    // Set the refresh token in a secure, HttpOnly cookie.
    res.cookie('refreshToken', authResult.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production.
      sameSite: 'strict', // Helps mitigate CSRF attacks.
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    })

    // Send the short-lived access token in the response body.
    res.status(200).json({ accessToken: authResult.accessToken })
  } catch (error) {
    console.error('Authentication error:', error)

    // If the token is invalid, expired, or verification fails, send a 401.
    res.status(401).json({ message: 'Unauthorized: Invalid token' })
  }
}
