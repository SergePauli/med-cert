import { AxiosResponse } from "axios"
import $api, { API_URL } from "../http"
import { IDiagnosis } from "../models/responses/IDiagnosis"

export default class DiagnosisService {
  static async fetchDiagnoses(query: any): Promise<AxiosResponse<IDiagnosis[]>> {
    return $api.post(`${API_URL}model/Diagnosis/`, { q: query, offset: 0, limit: 200 })
  }
  static async fetchExtDiagnoses(query: any): Promise<AxiosResponse<IDiagnosis[]>> {
    return $api.post(`${API_URL}model/ExtDiagnosis/`, { q: query, offset: 0, limit: 200 })
  }
}
