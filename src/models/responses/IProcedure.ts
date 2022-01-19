import { IMedicalServs } from "./IMedservs"

export interface IProcedure {
  id?: number
  medical_serv: IMedicalServs
  text_value?: String
  effective_time?: string
}
