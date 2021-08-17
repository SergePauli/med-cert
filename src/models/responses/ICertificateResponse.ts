import { IReference } from "../IReference"

export interface ICertificateResponse {
  id: number
  series: string
  number: string
  eff_time: Date
  cert_type: IReference
  series_prev: string
  number_prev: string
  eff_time_prev: Date
}
