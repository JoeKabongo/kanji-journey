import db from '../db'
import { TokenPayload } from 'google-auth-library'
import { randomBytes } from 'crypto'
import jwt from 'jsonwebtoken'
import { User } from '../../../shared/types/user'

export interface AuthenticationResult {
  userId: number // It's better practice for this to be a number if your DB uses SERIAL
  accessToken: string
  refreshToken: string
}

/**
 * Main authentication function. Orchestrates finding/creating a user,
 * revoking old sessions, and creating new access and refresh tokens.
 */
export const authenticateViaGoogle = async (
  googlePayload: TokenPayload
): Promise<AuthenticationResult> => {
  // Find or create a user in the database based on the verified Google payload.
  const user = await findOrCreateUser(googlePayload)

  // For enhanced security, delete any existing refresh tokens for this user.
  // This ensures a user can only have one active session at a time.
  await db.none(`DELETE FROM refresh_tokens WHERE user_id = $1`, [user.id])

  // Generate a new, long-lived refresh token and store it in the database.
  const refreshToken: string = await generateRefreshToken(user.id)

  // Generate a new, short-lived JWT access token.
  const secretKey = process.env.JWT_SECRET
  if (!secretKey) {
    throw new Error('JWT_SECRET is not defined in environment variables.')
  }

  const accessToken = jwt.sign({ userId: user.id }, secretKey, {
    expiresIn: '15m', // Standard short lifespan
  })

  return {
    userId: user.id,
    accessToken,
    refreshToken,
  }
}

/**
 * Finds an existing user by their Google ID or creates a new one if not found.
 * @param googlePayload - The verified payload from the Google ID token.
 * @returns The user data.
 */
const findOrCreateUser = async (googlePayload: TokenPayload): Promise<User> => {
  const { sub: googleId, email, name, picture } = googlePayload

  if (!email) {
    throw new Error('Email not provided by Google, cannot create user.')
  }

  let user = await db.oneOrNone<User>(
    `SELECT * FROM users WHERE google_id = $1`,
    [googleId]
  )

  // If the user doesn't exist, create a new record.
  if (!user) {
    user = await db.one<User>(
      `
        INSERT INTO users (google_id, email, name, profile_picture_url)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `,
      [googleId, email, name, picture]
    )
  }

  return user
}

/**
 * Generates a secure, random refresh token, stores it in the database,
 * and sets its expiration date.
 * @param userId - The ID of the user to associate the token with.
 * @returns The generated refresh token string.
 */
const generateRefreshToken = async (userId: number): Promise<string> => {
  const refreshToken = randomBytes(40).toString('hex')
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 30) // Set expiration for 30 days

  await db.none(
    `
      INSERT INTO refresh_tokens (token, user_id, expires_at)
      VALUES ($1, $2, $3)
    `,
    [refreshToken, userId, expiresAt]
  )

  return refreshToken
}
