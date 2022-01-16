import { IDestroyble } from "../IDestroyble"
import { IDiagnosis } from "../responses/IDiagnosis"
import { INullFlavorableR } from "./INullFlavorableR"
import { IProcedureR } from "./IProcedureR"

export interface IDeathReasonR extends INullFlavorableR, IDestroyble {
  id?: number
  guid?: string
  certificate_id: number
  diagnosis?: IDiagnosis
  diagnosis_id?: number
  effective_time?: Date
  procedures_attributes?: IProcedureR[]
}
