import { INullFlavorR } from "../INullFlavor"
import { IAddressR } from "./IAddressR"
import { IAuthenticatorR } from "./IAuthenticatorR"
import { IChildInfoR } from "./IChildInfoR"
import { IDeathReasonR } from "./IDeathReasonR"
import { IParticipantR } from "./IParticipintR"
import { IPatientR } from "./IPatientR"

export interface ICertificateR {
  id?: number
  number?: string
  series: string
  issue_date?: Date
  cert_type?: number
  death_addr_attributes?: IAddressR
  policy_OMS?: string
  patient_attributes?: IPatientR
  patient_id?: string
  life_area_type?: number
  death_area_type?: number
  death_datetime?: Date
  death_year?: number | undefined
  death_place?: number | undefined
  marital_status?: number | undefined
  education_level?: number | undefined
  social_status?: number | undefined
  death_kind?: number | undefined
  ext_reason_time?: Date | undefined
  ext_reason_description?: string | undefined
  established_medic?: number | undefined
  basis_determining?: number | undefined
  a_reason_attributes?: IDeathReasonR
  b_reason_attributes?: IDeathReasonR
  c_reason_attributes?: IDeathReasonR
  d_reason_attributes?: IDeathReasonR
  death_reasons_attributes?: IDeathReasonR[]
  reason_ACME?: string
  child_info_attributes?: IChildInfoR
  traffic_accident?: number
  pregnancy_connection?: number
  author_attributes?: IAuthenticatorR
  audithor_attributes?: IAuthenticatorR
  legal_authenticator_attributes?: IAuthenticatorR
  custodian_id?: number
  participant_attributes?: IParticipantR
  guid: string
  null_flavors_attributes?: INullFlavorR[]
  series_prev?: string
  number_prev?: string
  eff_time_prev?: string
}
