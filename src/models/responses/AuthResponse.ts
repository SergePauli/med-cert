import { IUser } from "../IUser"
import { ITokens } from "../requests/ITokens"

export interface AuthResponse {
  tokens: ITokens
  user: IUser
}
