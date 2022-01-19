import { IAuthenticator } from "./IAuthenticator"
import { IChildInfo } from "../IChildInfo"
import { INullFlavorable } from "../INullFlavorable"
import { IPatient } from "../IPatient"
import { IAddress } from "./IAddress"
import { IDeathReason } from "./IDeathReason"

export interface ICertificate extends INullFlavorable {
  id: number
  series?: string
  number?: string
  issue_date?: string
  cert_type?: number
  series_prev?: string
  number_prev?: string
  eff_time_prev?: string
  death_addr?: IAddress
  policy_OMS?: string
  patient?: IPatient
  life_area_type?: number
  death_area_type?: number
  death_datetime?: string
  death_year?: number
  death_place?: number | undefined
  marital_status?: number | undefined
  education_level?: number | undefined
  social_status?: number | undefined
  death_kind?: number | undefined
  ext_reason_time?: string
  ext_reason_description?: string | undefined
  established_medic?: number | undefined
  basis_determining?: number | undefined
  a_reason?: IDeathReason
  b_reason?: IDeathReason
  c_reason?: IDeathReason
  d_reason?: IDeathReason
  death_reasons?: IDeathReason[]
  reason_ACME?: string
  child_info?: IChildInfo | undefined
  traffic_accident?: number
  pregnancy_connection?: number
  author?: IAuthenticator
  authenticator?: IAuthenticator
  legal_authenticator?: IAuthenticator
  custodian_id?: number
  guid: string
  latest_one?: ICertificate
  create_at: string
}
