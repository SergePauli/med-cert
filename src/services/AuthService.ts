import $api from "../http"
import { AxiosResponse } from "axios"
import { AuthResponse } from "../models/responses/AuthResponse"
import { IRegistration } from "../models/requests/IRegistration"
import { IPassRenew } from "../models/requests/IPassRenew"
export default class AuthService {
  static async login(email: string, password: string): Promise<AxiosResponse<AuthResponse>> {
    return $api.post("auth/login", { email, password })
  }
  static async registration(user: IRegistration): Promise<AxiosResponse<AuthResponse>> {
    return $api.post("auth/registration", { user })
  }
  static async renew_link(email: string): Promise<AxiosResponse<void>> {
    return $api.post("auth/renew_link", { email })
  }
  static async pwd_renew(user: IPassRenew): Promise<AxiosResponse<void>> {
    return $api.post("auth/pwd_renew", { user: user })
  }
  static async logout(): Promise<void> {
    return $api.post("auth/logout")
  }
}
