import { IDestroyble } from "../IDestroyble"

export interface IProcedureR extends IDestroyble {
  id?: number
  medical_serv_id?: number
  text_value?: String
  effective_time?: Date
}
