import { AxiosResponse } from "axios"
import $api, { API_URL } from "../http"
import { ICertificate } from "../models/responses/ICertificate"

export default class CertificateService {
  //POST request for get doctor's list
  // static async getDoctors(query: any): Promise<AxiosResponse<IDoctor[]>> {
  //   return $api.post(`${API_URL}model/Doctor/`, { ...query, offset: 0, limit: 10, ...DOCTOR_RENDER_OPTIONS })
  // }

  //POST request for add  /REST_API/v1/model/Certificate/add
  static async addCertificate(certificate: ICertificate): Promise<AxiosResponse<ICertificate>> {
    return $api.post(`${API_URL}model/Certificate/add`, {
      Certificate: certificate,
    })
  }

  //PUT request for update Certificate /REST_API/v1/model/Certificate/:id
  static async updateCertificate(request: any): Promise<AxiosResponse<ICertificate>> {
    return $api.put(`${API_URL}model/Certificate/${request.Certificate.id}`, request)
  }
  // DELETE request for remove Certificate /REST_API/v1/model/Certificate/:id
  static async removeCertificate(certificate_id: number): Promise<AxiosResponse<ICertificate>> {
    return $api.delete(`${API_URL}model/Certificate/${certificate_id}`)
  }
}
