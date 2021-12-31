import { IAuthenticator } from "../IAuthenticator"
import { IChildInfo } from "../IChildInfo"
import { INullFlavorable } from "../INullFlavorable"
import { IPatient } from "../IPatient"
import { IReference } from "../IReference"
import { IAddress } from "./IAddress"
import { IDeathReason } from "./IDeathReason"

export interface ICertificate extends INullFlavorable {
  id: number
  series: string
  number: string
  eff_time: Date
  cert_type: IReference
  series_prev?: string
  number_prev?: string
  eff_time_prev?: Date
  death_addr?: IAddress
  policy_OMS?: string
  patient?: IPatient
  lifeAreaType?: number
  deathAreaType?: number
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
  custodian?: number
  guid: string
}
