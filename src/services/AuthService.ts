import $api from "../http"
import { AxiosResponse } from "axios"
import { AuthResponse } from "../models/responses/AuthResponse"
import { IRegistration } from "../models/requests/IRegistration"
export default class AuthService {
  static async login(email: string, password: string): Promise<AxiosResponse<AuthResponse>> {
    return $api.post("auth/login", { email, password })
  }
  static async registration(user: IRegistration): Promise<AxiosResponse<AuthResponse>> {
    return $api.post("auth/registration", { user })
  }
  static async logout(): Promise<void> {
    return $api.post("auth/logout")
  }
}
