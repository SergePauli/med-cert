import { IMedicalServs } from "./IMedservs"

export interface IProcedure {
  id?: number
  external_reason: string
  medical_serv: IMedicalServs
  text_value?: String
  effective_time?: Date
}
