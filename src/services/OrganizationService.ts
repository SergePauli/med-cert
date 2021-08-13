import $api, { API_URL } from "../http"
import { AxiosResponse } from "axios"
import { IReference } from "../models/IReference"
export default class OrganizationService {
  // public endpoint
  static async getOrganizations(): Promise<AxiosResponse<{ organizations: IReference[] }>> {
    return $api.get(`${API_URL}auth/organizations/`)
  }
}
