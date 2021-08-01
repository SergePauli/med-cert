import axios, { AxiosRequestConfig } from "axios"
import { AuthResponse } from "../models/responses/AuthResponse"
export const API_URL = "http://localhost:5000/REST_API/v1/"
const $api = axios.create({
  withCredentials: true,
  baseURL: API_URL,
})

$api.interceptors.request.use((config: AxiosRequestConfig) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`
  return config
})

$api.interceptors.response.use(
  (config) => config,
  async (error) => {
    const originalRequest = error.config
    if (error.response.status === 401 && error.config && !error.config._isRetry) {
      originalRequest._isRetry = true
      try {
        const response = await axios.get<AuthResponse>(`${API_URL}auth/refresh`, { withCredentials: true })
        localStorage.setItem("token", response.data.tokens.access)
        return $api.request(originalRequest)
      } catch (e) {
        throw new Error("API error 401, Сеанс не авторизован")
      }
    } else if ([406, 422].includes(error.response.status)) {
      if (error.response.data && error.response.data.errors) {
        let message = error.response.data.errors.reduce((result: string, element: string) => {
          result = `${result}, ${element}`
          return result
        }, `API error ${error.response.status}`)
        throw new Error(message)
      } else throw new Error(`API error ${error.response.status}`)
    }
    throw error
  }
)
export default $api
