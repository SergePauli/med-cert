import { INullFlavorable } from "../INullFlavorable"
import { IDiagnosis } from "./IDiagnosis"
import { IProcedure } from "./IProcedure"

export interface IDeathReason extends INullFlavorable {
  id?: number
  guid?: string
  certificate_id: number
  diagnosis?: IDiagnosis
  effective_time?: string
  procedures?: IProcedure[]
}
