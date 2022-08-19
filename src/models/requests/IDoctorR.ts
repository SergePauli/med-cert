import { INullFlavorableR } from "./INullFlavorableR"
import { IPersonR } from "./IPersonR"

export interface IDoctorR extends INullFlavorableR {
  id?: number
  person_attributes: IPersonR
  position_id?: number
  organization_id?: number
  department?: string | null
  office?: string | null
  guid: string
}
