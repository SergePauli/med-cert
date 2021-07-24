import $api from "../http"
import { AxiosResponse } from "axios"
import { AuthResponse } from "../models/responses/AuthResponse"
export default class AuthService {
  static async login(email: string, password: string): Promise<AxiosResponse<AuthResponse>> {
    return $api.post("/login", { email, password })
  }
}
