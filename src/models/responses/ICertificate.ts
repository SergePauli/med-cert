import { IAuthenticator } from "../IAuthenticator"
import { IChildInfo } from "../IChildInfo"
import { INullFlavorable } from "../INullFlavorable"
import { IPatient } from "../IPatient"
import { IReferenceId } from "../IReference"
import { IAddress } from "./IAddress"
import { IDeathReason } from "./IDeathReason"

export interface ICertificate extends INullFlavorable {
  id: number
  series?: string
  number?: string
  eff_time: Date
  cert_type?: number
  series_prev?: string
  number_prev?: string
  eff_time_prev?: Date
  death_addr?: IAddress
  death_addr_attributes?: IAddress
  policy_OMS?: string
  patient?: IPatient
  patient_attributes?: IPatient
  life_area_type?: number
  death_area_type?: number
  death_datetime?: Date
  death_year?: number
  death_month?: number
  death_day?: number
  death_place?: number | undefined
  marital_status?: number | undefined
  education_level?: number | undefined
  social_status?: number | undefined
  death_kind?: number | undefined
  ext_reason_time?: Date | undefined
  ext_reason_description?: string | undefined
  established_medic?: number | undefined
  basis_determining?: number | undefined
  a_reason?: IDeathReason
  a_reason_attributes?: IDeathReason
  b_reason?: IDeathReason
  b_reason_attributes?: IDeathReason
  c_reason?: IDeathReason
  c_reason_attributes?: IDeathReason
  d_reason?: IDeathReason
  d_reason_attributes?: IDeathReason
  death_reasons?: IDeathReason[]
  death_reasons_attributes?: IDeathReason[]
  reason_ACME?: string
  child_info?: IChildInfo | undefined
  child_info_attributes?: IChildInfo
  traffic_accident?: number
  pregnancy_connection?: number
  author?: IAuthenticator
  author_attributes?: IAuthenticator
  authenticator?: IAuthenticator
  authenticator_attributes?: IAuthenticator
  legal_authenticator?: IAuthenticator
  legal_authenticator_attributes?: IAuthenticator
  custodian: IReferenceId
  custodian_id?: number
  guid: string
}
