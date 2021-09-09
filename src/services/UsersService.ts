import $api, { API_URL } from "../http"
import { AxiosResponse } from "axios"
import { IUser } from "../models/IUser"
import { IUserInfo } from "../models/responses/IUserInfo"
export default class UsersService {
  static async fetchUsers(): Promise<AxiosResponse<IUser[]>> {
    return $api.post(`${API_URL}model/user/`, {
      render_options: { only: ["id", "email", "roles", "organization_id", "activated"] },
    })
  }
  static async getUser(id: string): Promise<AxiosResponse<IUserInfo>> {
    return $api.post(`${API_URL}model/user/` + id, {
      render_options: { only: ["id", "roles"], include: ["person_name", "organization", "contacts"] },
      includes: ["person_name", "organization", "contacts"],
      organization: { only: ["id", "name"] },
    })
  }
}
