import apiClient from './apiClient' // Import the centralized instance
import { User } from '../../../shared/types/user'

/**
 * Forwards a Google ID token to the backend for validation.
 */
export const loginWithGoogle = async (idToken: string): Promise<User> => {
  // This specific call still needs to manually set the Authorization header
  // because we don't have an access token yet.
  const response = await apiClient.post<User>(
    '/auth/google-auth',
    {},
    {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    }
  )
  return response.data
}
