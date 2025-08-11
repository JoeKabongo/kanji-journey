import axios from 'axios'

const API_END_POINT = import.meta.env.VITE_REACT_APP_API_URL

const apiClient = axios.create({
  baseURL: API_END_POINT,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default apiClient
