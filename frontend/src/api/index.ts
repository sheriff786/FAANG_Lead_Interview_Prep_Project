import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  timeout: 120000,  // 2 min for LLM calls
  headers: { 'Content-Type': 'application/json' },
})

export default api
