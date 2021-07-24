import { makeAutoObservable } from "mobx"
import { IUser } from "../models/IUser"
import { IRegistration } from "../models/requests/IRegistration"
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
      const response = await AuthService.registration(user)
      localStorage.setItem("token", response.data.accessToken)
    } catch (e) {
      console.log(e.response?.data?.message)
    }
  }
}
