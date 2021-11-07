import { INullFlavorable } from "../INullFlavorable"
import { IDiagnosis } from "./IDiagnosis"

export interface IDeathReason extends INullFlavorable {
  id?: string
  certificate_id: number
  diagnosis: IDiagnosis
  effective_time?: Date
}
