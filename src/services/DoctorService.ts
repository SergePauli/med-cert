//All interactions with the API for working with the doctors model
//Все взаимодействия с API для работы с моделью  врачей

import { AxiosResponse } from "axios"
import $api, { API_URL } from "../http"
import { IDoctor } from "../models/IDoctor"
import { IReferenceId } from "../models/IReference"
import { DOCTOR_RENDER_OPTIONS, getDoctorRequest } from "../models/requests/DoctorRequest"

export default class DoctorService {
  //POST request for get doctor's list
  static async getDoctors(query: any): Promise<AxiosResponse<IDoctor[]>> {
    return $api.post(`${API_URL}model/Doctor/`, { ...query, offset: 0, limit: 10, ...DOCTOR_RENDER_OPTIONS })
  }
  //POST request for get list of pasible values for Doctor.position field
  static async getPositions(query: any): Promise<AxiosResponse<IReferenceId[]>> {
    return $api.post(`${API_URL}model/Position/`, { q: query, offset: 0, limit: 200 })
  }
  //POST request for add Doctor /REST_API/v1/model/Doctor/add
  static async addDoctor(doctor: IDoctor): Promise<AxiosResponse<IDoctor>> {
    return $api.post(`${API_URL}model/Doctor/add`, {
      Doctor: getDoctorRequest(doctor),
      ...DOCTOR_RENDER_OPTIONS,
    })
  }
  //PUT request for update Doctor /REST_API/v1/model/Doctor/:id
  static async updateDoctor(doctor: IDoctor): Promise<AxiosResponse<IDoctor>> {
    return $api.put(`${API_URL}model/Doctor/${doctor.id}`, {
      Doctor: getDoctorRequest(doctor),
      ...DOCTOR_RENDER_OPTIONS,
    })
  }
  // DELETE request for remove Doctor /REST_API/v1/model/Doctor/:id
  static async removeDoctor(doctor_id: number): Promise<AxiosResponse<IDoctor>> {
    return $api.delete(`${API_URL}model/Doctor/${doctor_id}`)
  }
}
