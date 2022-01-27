import { INullFlavorable } from "../INullFlavorable"
import { IDiagnosis } from "./IDiagnosis"
import { IProcedure } from "./IProcedure"

export interface IDeathReason extends INullFlavorable {
  id?: number
  guid?: string
  certificate_id: number
  diagnosis?: IDiagnosis
  ext_diagnosis?: IDiagnosis
  effective_time?: string
  years?: number
  months?: number
  weeks?: number
  days?: number
  hours?: number
  minutes?: number
  procedures?: IProcedure[]
}
