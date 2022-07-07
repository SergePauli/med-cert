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
  issue_date?: string | null
  cert_type?: number
  death_addr_attributes?: IAddressR
  policy_OMS?: string | null
  patient_attributes?: IPatientR
  patient_id?: string
  life_area_type?: number | null
  death_area_type?: number | null
  death_datetime?: Date | null
  death_year?: number | null
  death_place?: number | null
  marital_status?: number | null
  education_level?: number | null
  social_status?: number | null
  death_kind?: number | null
  ext_reason_time?: Date | null
  ext_reason_description?: string | null
  established_medic?: number | null
  basis_determining?: number | null
  a_reason_attributes?: IDeathReasonR
  b_reason_attributes?: IDeathReasonR
  c_reason_attributes?: IDeathReasonR
  d_reason_attributes?: IDeathReasonR
  death_reasons_attributes?: IDeathReasonR[]
  reason_ACME?: string | null
  child_info_attributes?: IChildInfoR
  traffic_accident?: number | null
  pregnancy_connection?: number | null
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
