import { IDestroyble } from "../IDestroyble"
import { INullFlavorableR } from "./INullFlavorableR"

export interface IProcedureR extends IDestroyble, INullFlavorableR {
  id?: number
  guid: string
  medical_serv_id?: number
  text_value?: String
  effective_time?: String
}
