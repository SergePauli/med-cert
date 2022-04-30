import { IDestroyble } from "../IDestroyble"
import { INullFlavorableR } from "./INullFlavorableR"
import { IProcedureR } from "./IProcedureR"

export interface IDeathReasonR extends INullFlavorableR, IDestroyble {
  id?: number
  guid?: string
  certificate_id: number
  diagnosis_id?: number | null
  ext_diagnosis_id?: number | null
  effective_time?: Date | null
  years?: number | null
  months?: number | null
  weeks?: number | null
  days?: number | null
  hours?: number | null
  minutes?: number | null
  procedures_attributes?: IProcedureR[]
}
