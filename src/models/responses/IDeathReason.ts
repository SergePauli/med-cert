import { IDiagnosis } from "./IDiagnosis"

export interface IDeathReason {
  id?: string
  certificate_id: number
  diagnosis: IDiagnosis
  effective_time?: Date
}
