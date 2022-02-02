import axios from "axios"
import { makeAutoObservable } from "mobx"
import { API_URL } from "../http"
import { IUser } from "../models/IUser"
import { IPassRenew } from "../models/requests/IPassRenew"
import { IRegistration } from "../models/requests/IRegistration"
import { AuthResponse } from "../models/responses/AuthResponse"
import { IUserInfo } from "../models/responses/IUserInfo"
import AuthService from "../services/AuthService"
import UsersService from "../services/UsersService"
import { HOME_ROUTE, LOGIN_ROUTE } from "../utils/consts"

export default class UserStore {
  private _isAuth: boolean
  private _user: IUser
  private _isLoding: boolean
  private _history: any
  private _token: string
  private _userInfo?: IUserInfo

  constructor() {
    this._user = {} as IUser
    this._isLoding = false
    this._token = localStorage.getItem("token") || ""
    this._isAuth = this._token !== ""
    if (this._isAuth) this.checkAuth()
    makeAutoObservable(this)
  }

  setAuth(isAuth: boolean) {
    this._isAuth = isAuth
  }
  isAuth() {
    return this._isAuth
  }
  setUser(user: IUser) {
    this._user = user
  }
  user() {
    return this._user
  }
  setLoading(isLoding: boolean) {
    this._isLoding = isLoding
  }
  isLoading() {
    return this._isLoding
  }
  setHistory(history: any) {
    this._history = history
  }

  setToken(access_token: string) {
    this._token = access_token
  }
  token() {
    return this._token
  }
  async login(email: string, password: string) {
    AuthService.login(email, password)
      .then((response) => {
        if (response.data) {
          localStorage.setItem("token", response.data.tokens.access)
          this.setAuth(true)
          this.setUser(response.data.user)
          this._history.push(HOME_ROUTE)
        } else {
          this._history.push("/error/Ошибка авторизации: неверный ответ API-сервера")
        }
      })
      .catch((reason) => {
        this._history.push("/error/Auth1:" + reason.message)
      })
  }
  async registration(user: IRegistration) {
    try {
      await AuthService.registration(user)
      this._history.push(
        "/message/Ваша заявка направлена администратору ресурса для активации. Письмо с результатом, будет выслано на Ваш email"
      )
    } catch (e: any) {
      this._history.push("/error/" + e.message)
    }
  }
  async pwd_renew(user: IPassRenew) {
    try {
      await AuthService.pwd_renew(user)
      this._history.push("/message/Пароль был успешно изменен")
    } catch (e: any) {
      this._history.push("/error/" + e.message)
      return false
    }
  }
  async renew_link(email: string) {
    try {
      await AuthService.renew_link(email)
      this._history.push("/message/Вам в почту направлено письмо, со ссылкой на страницу изменения пароля")
    } catch (e: any) {
      this._history.push("/error/" + e.message)
      return false
    }
  }
  async logout() {
    try {
      await AuthService.logout()
      this.setAuth(false)
      localStorage.removeItem("token")
      this.setToken("")
      this.setUser({} as IUser)
      this._userInfo = undefined
      this._history.push(LOGIN_ROUTE)
    } catch (e: any) {
      this._history.push("/error/" + e.message)
    }
  }
  async checkAuth() {
    try {
      this.setLoading(true)
      const response = await axios.get<AuthResponse>(`${API_URL}auth/refresh`, { withCredentials: true })
      localStorage.setItem("token", response.data.tokens.access)
      this.setToken(response.data.tokens.access)
      this.setAuth(true)
      this.setUser(response.data.user)
    } catch (e: any) {
      if (e.message?.includes("401")) {
        this._isAuth = false
        this._token = ""
        localStorage.removeItem("token")
        this._user = {} as IUser
        this._history.push(LOGIN_ROUTE)
      } else this._history.push("/error/Auth2:" + e.message)
    } finally {
      this.setLoading(false)
    }
  }
  async getUserInfo(id: number) {
    if (id === undefined) return false
    try {
      this.setLoading(true)
      const response = await UsersService.getUser(id)
      return response.data
    } catch (e: any) {
      this._history.push("/error/Auth3:" + e.message)
    } finally {
      this.setLoading(false)
    }
  }
  history() {
    return this._history
  }
  get userInfo() {
    if (this._userInfo) return this._userInfo
    else if (this._user.id)
      this.getUserInfo(this._user.id).then((response) => {
        if (response) this._userInfo = response
        else this._userInfo = undefined
      })
    return null
  }
}
