import { AxiosResponse } from "axios"
import $api, { API_URL } from "../http"
import { NULLFLAVORABLE_RENDER_OPTIONS } from "../models/render_options/address"
import { DEFAULT_AUTHENTICATOR_RENDER_OPTIONS } from "../models/render_options/Authenticator"
import { CHILD_INFO_RENDER_OPTIONS } from "../models/render_options/child_info"
import { DEFAULT_RENDER_OPTIONS } from "../models/render_options/default"
import { SHORT_DOCTOR_RENDER_OPTIONS } from "../models/render_options/Doctor"
import { EXTERNAL_DEATH_REASON_RENDER_OPTIONS } from "../models/render_options/external_death_reason"
import { LETTERED_DEATH_REASON_RENDER_OPTIONS } from "../models/render_options/lettered_reason"
import { OTHER_REASON_RENDER_OPTIONS } from "../models/render_options/other_reason"
import { PARTICIPANT_RENDER_OPTIONS } from "../models/render_options/Participant"
import { PATIENT_RENDER_OPTIONS } from "../models/render_options/patient"
import { PERSON_RENDER_OPTIONS } from "../models/render_options/person"
import { PROCEDURE_RENDER_OPTIONS } from "../models/render_options/procedure"
import { RELATED_SUBJECT_RENDER_OPTIONS } from "../models/render_options/related_subject"
import { ICertificateR } from "../models/requests/ICertificateR"
import { ICertificate } from "../models/responses/ICertificate"

export const CERTIFICATE_FULL_RENDER_OPTIONS = {
  render_options: {
    except: ["custodian_id", "patient_id", "updated_at"],
    include: [
      "patient",
      "author",
      "legal_authenticator",
      "audithor",
      "a_reason",
      "b_reason",
      "c_reason",
      "d_reason",
      "death_addr",
      "child_info",
      "custodian",
      "death_reasons",
      "participant",
      "null_flavors",
      "latest_one",
    ],
  },
  includes: [
    "patient",
    "participant",
    "custodian",
    "a_reason",
    "b_reason",
    "c_reason",
    "d_reason",
    "death_addr",
    "child_info",
    "death_reasons",
    "latest_one",
  ],
  death_addr: NULLFLAVORABLE_RENDER_OPTIONS,
  patient: PATIENT_RENDER_OPTIONS,
  identity: NULLFLAVORABLE_RENDER_OPTIONS,
  address: NULLFLAVORABLE_RENDER_OPTIONS,
  a_reason: LETTERED_DEATH_REASON_RENDER_OPTIONS,
  b_reason: LETTERED_DEATH_REASON_RENDER_OPTIONS,
  c_reason: LETTERED_DEATH_REASON_RENDER_OPTIONS,
  d_reason: EXTERNAL_DEATH_REASON_RENDER_OPTIONS,
  author: DEFAULT_AUTHENTICATOR_RENDER_OPTIONS,
  legal_authenticator: DEFAULT_AUTHENTICATOR_RENDER_OPTIONS,
  audithor: DEFAULT_AUTHENTICATOR_RENDER_OPTIONS,
  death_reasons: OTHER_REASON_RENDER_OPTIONS,
  procedures: PROCEDURE_RENDER_OPTIONS,
  child_info: CHILD_INFO_RENDER_OPTIONS,
  related_subject: RELATED_SUBJECT_RENDER_OPTIONS,
  addr: NULLFLAVORABLE_RENDER_OPTIONS,
  person: PERSON_RENDER_OPTIONS,
  doctor: SHORT_DOCTOR_RENDER_OPTIONS,
  participant: PARTICIPANT_RENDER_OPTIONS,
  position: { only: ["id", "name"] },
  custodian: { only: ["id", "name"] },
  null_flavors: DEFAULT_RENDER_OPTIONS,
}

export default class CertificateService {
  //POST request for get Certificate's list
  static async getCertificates(query: any, first = 0, last = 9): Promise<AxiosResponse<ICertificate[]>> {
    return $api.post(`${API_URL}model/Certificate/`, {
      ...query,
      offset: first,
      limit: last - first + 1,
      ...CERTIFICATE_FULL_RENDER_OPTIONS,
    })
  }

  // POST request for get Certificate's count
  static async getCount(query: any): Promise<AxiosResponse<number>> {
    return $api.post(`${API_URL}model/Certificate/`, { ...query, count: "1" })
  }

  //POST request for add  /REST_API/v1/model/Certificate/add
  static async addCertificate(certificate: ICertificateR): Promise<AxiosResponse<ICertificate>> {
    return $api.post(`${API_URL}model/Certificate/add`, {
      Certificate: certificate,
      ...CERTIFICATE_FULL_RENDER_OPTIONS,
    })
  }

  //PUT request for update Certificate /REST_API/v1/model/Certificate/:id
  static async updateCertificate(request: any): Promise<AxiosResponse<ICertificate>> {
    return $api.put(`${API_URL}model/Certificate/${request.Certificate.id}`, {
      ...request,
      ...CERTIFICATE_FULL_RENDER_OPTIONS,
    })
  }
  // DELETE request for remove Certificate /REST_API/v1/model/Certificate/:id
  static async removeCertificate(certificate_id: number): Promise<AxiosResponse<ICertificate>> {
    return $api.delete(`${API_URL}model/Certificate/${certificate_id}`)
  }
}
