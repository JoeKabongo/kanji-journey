import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GoogleLogin, GoogleCredentialResponse } from '@react-oauth/google'

import { loginWithGoogle } from '../services/authService'
import { useAuth } from '../context/AuthContext'

/**
 * Renders the sign-in page and handles the entire Google authentication flow.
 */
const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [error, setError] = useState<string | null>(null)

  /**
   * Handles a successful sign-in from Google. Sends the credential to the backend
   * for verification and updates the global authentication state upon success.
   */
  const onGoogleLoginSuccess = async (
    credentialResponse: GoogleCredentialResponse
  ) => {
    if (!credentialResponse.credential) {
      return setError('Login failed: No credential returned from Google.')
    }

    try {
      setError(null) // Clear previous errors on a new attempt
      const user = await loginWithGoogle(credentialResponse.credential)

      // Update global state to log the user in across the app.
      login(user)
      navigate('/')
    } catch (err) {
      console.error('Authentication error:', err)
      setError('Login failed. Please verify your credentials.')
    }
  }

  /**
   * Handles cases where the Google Sign-In pop-up itself fails.
   */
  const onGoogleLoginFailure = () => {
    console.error('Google Sign-In process failed.')
    setError('Google Sign-In failed. Please try again.')
  }

  return (
    <div>
      <h2>Sign In</h2>
      <GoogleLogin
        onSuccess={onGoogleLoginSuccess}
        onError={onGoogleLoginFailure}
      />

      {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
    </div>
  )
}

export default Login
