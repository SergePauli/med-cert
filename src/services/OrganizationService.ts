import $api, { API_URL } from "../http"
import { AxiosResponse } from "axios"
import { IReferenceId } from "../models/IReference"
import { IOrganization } from "../models/IOrganization"

const ORGANIZATION_RENDER_OPTIONS = {
  render_options: { except: ["updated_at", "old_oid"], include: ["address", "contacts"] },
  includes: ["address", "contacts"],
}
export default class OrganizationService {
  // GET from public endpoint /auth/organizations/
  static async getOrganizations(): Promise<AxiosResponse<{ organizations: IReferenceId[] }>> {
    return $api.get(`${API_URL}auth/organizations/`)
  }

  // POST /show/model/Organization/:id from UEC endpoint
  static async getOrganization(id: string): Promise<AxiosResponse<IOrganization>> {
    return $api.post(`${API_URL}/show/model/Organization/${id}`, ORGANIZATION_RENDER_OPTIONS)
  }
  //PUT request for update Doctor /REST_API/v1/model/Doctor/:id
  static async updateOrganization(request: any): Promise<AxiosResponse<IOrganization>> {
    return $api.put(`${API_URL}model/Organization/${request.Organization.id}`, {
      ...request,
      ...ORGANIZATION_RENDER_OPTIONS,
    })
  }
}
