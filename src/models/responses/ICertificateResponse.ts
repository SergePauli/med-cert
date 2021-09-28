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
  policyOMS?: string
  patient: IPatient
  lifeAreaType?: number
  deathAreaType?: number
  death_datetime: Date | Date[] | undefined
  death_year: number
  death_month: number
  death_day: number
  guid: string
}
