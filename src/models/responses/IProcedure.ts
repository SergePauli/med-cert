import { IDestroyble } from "../IDestroyble"
import { IMedicalServs } from "./IMedservs"

export interface IProcedure extends IDestroyble {
  id?: number
  medical_serv: IMedicalServs
  medical_serv_id?: number
  text_value?: String
  effective_time?: Date
}
