import IIdentityR from "./IIdentityR"
import { IPersonR } from "./IPersonR"

export interface IParticipantR {
  id?: number
  identity_attributes?: IIdentityR
  description?: string
  person_attributes?: IPersonR
  receipt_date: string
  original: boolean
}
