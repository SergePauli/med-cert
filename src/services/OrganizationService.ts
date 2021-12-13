import $api, { API_URL } from "../http"
import { AxiosResponse } from "axios"
import { IReferenceId } from "../models/IReference"
import { IOrganization } from "../models/IOrganization"
export default class OrganizationService {
  // GET from public endpoint /auth/organizations/
  static async getOrganizations(): Promise<AxiosResponse<{ organizations: IReferenceId[] }>> {
    return $api.get(`${API_URL}auth/organizations/`)
  }

  // POST /show/model/Organization/:id from UEC endpoint
  static async getOrganization(id: number): Promise<AxiosResponse<IOrganization>> {
    return $api.post(`${API_URL}/show/model/Organization/${id}`, {
      render_options: { except: ["updated_at", "old_oid"], include: ["address", "contacts"] },
      includes: ["address", "contacts"],
    })
  }
}
