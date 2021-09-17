import { IFiasItem } from "./IFiasItem"

export interface IFiasResponse {
  status: string
  message: string
  total_found?: number
  data: IFiasItem[]
}
