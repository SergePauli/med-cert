import { AxiosResponse } from "axios"
import $api, { API_URL } from "../http"
import { IDiagnosis } from "../models/responses/IDiagnosis"
import { IMedicalServs } from "../models/responses/IMedservs"

export default class DiagnosisService {
  static async fetchDiagnoses(query: any): Promise<AxiosResponse<IDiagnosis[]>> {
    return $api.post(`${API_URL}model/Diagnosis/`, { q: query, offset: 0, limit: 200 })
  }
  static async fetchExtDiagnoses(query: any): Promise<AxiosResponse<IDiagnosis[]>> {
    return $api.post(`${API_URL}model/ExtDiagnosis/`, { q: query, offset: 0, limit: 200 })
  }
  static async fetchMedicalServs(query: any): Promise<AxiosResponse<IMedicalServs[]>> {
    return $api.post(`${API_URL}model/MedicalServ/`, { q: query, offset: 0, limit: 200 })
  }
}
