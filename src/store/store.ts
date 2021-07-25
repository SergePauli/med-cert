import axios from "axios"
import { makeAutoObservable } from "mobx"
import { API_URL } from "../http"
import { IUser } from "../models/IUser"
import { IRegistration } from "../models/requests/IRegistration"
import { AuthResponse } from "../models/responses/AuthResponse"
import AuthService from "../services/AuthService"

export default class Store {
  user = {} as IUser
  isAuth = false
  constructor() {
    makeAutoObservable(this)
  }
  setAuth(isAuth: boolean) {
    this.isAuth = isAuth
  }
  setUser(user: IUser) {
    this.user = user
  }
  async login(email: string, password: string) {
    try {
      const response = await AuthService.login(email, password)
      localStorage.setItem("token", response.data.accessToken)
      this.setAuth(true)
      this.setUser(response.data.user)
    } catch (e) {
      console.log(e.response?.data?.message)
    }
  }
  async registration(user: IRegistration) {
    try {
      await AuthService.registration(user)
    } catch (e) {
      console.log(e.response?.data?.message)
    }
  }
  async logout() {
    try {
      await AuthService.logout()
      this.setAuth(false)
      localStorage.removeItem("token")
      this.setUser({} as IUser)
    } catch (e) {
      console.log(e.response?.data?.message)
    }
  }
  async checkAuth() {
    try {
      const response = await axios.get<AuthResponse>(`${API_URL}auth/refresh`, { withCredentials: true })
      localStorage.setItem("token", response.data.accessToken)
      this.setAuth(true)
      this.setUser(response.data.user)
    } catch (e) {
      console.log(e.response?.data?.message)
    }
  }
}
