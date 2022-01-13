import { IDestroyble } from "../IDestroyble"
import { INullFlavorable } from "../INullFlavorable"
import { IDiagnosis } from "./IDiagnosis"
import { IProcedure } from "./IProcedure"

export interface IDeathReason extends INullFlavorable, IDestroyble {
  id?: string
  guid?: string
  certificate_id: number
  diagnosis?: IDiagnosis
  diagnosis_id?: number
  effective_time?: Date
  procedures?: IProcedure[]
  procedures_attributes?: IProcedure[]
}
