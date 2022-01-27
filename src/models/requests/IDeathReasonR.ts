import { IDestroyble } from "../IDestroyble"
import { INullFlavorableR } from "./INullFlavorableR"
import { IProcedureR } from "./IProcedureR"

export interface IDeathReasonR extends INullFlavorableR, IDestroyble {
  id?: number
  guid?: string
  certificate_id: number
  diagnosis_id?: number
  ext_diagnosis_id?: number
  effective_time?: Date
  years?: number
  months?: number
  weeks?: number
  days?: number
  hours?: number
  minutes?: number
  procedures_attributes?: IProcedureR[]
}
