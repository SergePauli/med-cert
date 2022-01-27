import { INullFlavorable } from "../INullFlavorable"
import { IMedicalServs } from "./IMedservs"

export interface IProcedure extends INullFlavorable {
  id?: number
  guid: string
  medical_serv: IMedicalServs
  text_value?: string
  effective_time?: string
}
