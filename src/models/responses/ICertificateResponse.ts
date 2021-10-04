import { INullFlavorable } from "../INullFlavorable"
import { IPatient } from "../IPatient"
import { IReference } from "../IReference"
import { IAddress } from "./IAddress"

export interface ICertificateResponse extends INullFlavorable {
  id: number
  series: string
  number: string
  eff_time: Date
  cert_type: IReference
  series_prev: string
  number_prev: string
  eff_time_prev: Date
  death_addr?: IAddress
  policy_OMS?: string
  patient: IPatient
  lifeAreaType?: number
  deathAreaType?: number
  death_datetime: Date | Date[] | undefined
  death_year: number
  death_month: number
  death_day: number
  death_place: number | undefined
  marital_status: number | undefined
  education_level: number | undefined
  social_status: number | undefined
  death_kind: number | undefined
  guid: string
}
