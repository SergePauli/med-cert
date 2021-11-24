import { AxiosResponse } from "axios"
import $api, { API_URL } from "../http"
import { IDoctor } from "../models/IDoctor"
import { IDiagnosis } from "../models/responses/IDiagnosis"
import { IMedicalServs } from "../models/responses/IMedservs"

export default class DiagnosisService {
  static async getDoctors(query: any): Promise<AxiosResponse<IDoctor[]>> {
    return $api.post(`${API_URL}model/Doctor/`, { q: query, offset: 0, limit: 200 })
  }
}
