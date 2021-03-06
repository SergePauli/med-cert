import axios, { AxiosRequestConfig } from "axios"
import { AuthResponse } from "../models/responses/AuthResponse"

// настройки на back-end
//Main API service (Основной API) URL
export const API_URL = "http://api-medss.int.amurzdrav.ru/REST_API/v1/"
//FIAS service (Сервис адресов ФИАС) URL
export const FIAS_URL = "http://fias.int.amurzdrav.ru/fias"
//АСМЕ service (Сервис взаимодействия с АСМЕ) URL
export const ACME_URL = "http://acme.int.amurzdrav.ru/"

const $api = axios.create({
  withCredentials: true,
  baseURL: API_URL,
})

export const $fias = axios.create({
  baseURL: FIAS_URL,
})

export const $acme = axios.create({
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json; charset=utf-8",
    "X-Requested-With": "XMLHttpRequest",
  },
  baseURL: ACME_URL,
})

$api.interceptors.request.use((config: AxiosRequestConfig) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`
  return config
})

$api.interceptors.response.use(
  (config) => config,
  async (error) => {
    const originalRequest = error.config
    if (error.response && error.response.status === 401 && error.config && !error.config._isRetry) {
      originalRequest._isRetry = true
      try {
        const response = await axios.get<AuthResponse>(`${API_URL}auth/refresh`, { withCredentials: true })
        localStorage.setItem("token", response.data.tokens.access)
        return $api.request(originalRequest)
      } catch (e) {
        throw new Error("API error 401, Сеанс не авторизован")
      }
    } else if (error.response && [406, 422].includes(error.response.status)) {
      if (error.response.data && error.response.data.errors) {
        let message = error.response.data.errors.reduce((result: string, element: string) => {
          result = `${result}, ${element}`
          return result
        }, `API error ${error.response.status}`)
        throw new Error(message)
      } else throw new Error(`API error ${JSON.stringify(error)}`)
    }
    throw error
  }
)

$fias.interceptors.response.use(
  (config) => config,
  async (error) => {
    if (error.response && error.response.status && [406, 422].includes(error.response.status)) {
      if (error.response.data && error.response.data.errors) {
        let message = error.response.data.errors.reduce((result: string, element: string) => {
          result = `${result}, ${element}`
          return result
        }, `API error ${error.response.status}`)
        throw new Error(message)
      } else throw new Error(`API error ${error.response.status}`)
    } else if (error.message.includes("Network Error")) new Error("Ошибка сети: соединение не может быть установлено")
    throw error
  }
)
export default $api
