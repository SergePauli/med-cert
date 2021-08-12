import $api, { API_URL } from "../http"
import { AxiosResponse } from "axios"
import { IReference } from "../models/IReference"
export default class OrganizationService {
  static async getOrganizations(): Promise<AxiosResponse<{ organizations: IReference[] }>> {
    return $api.get(`${API_URL}auth/organizations/`)
  }
}
