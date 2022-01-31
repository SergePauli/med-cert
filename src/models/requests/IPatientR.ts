import IIdentityR from "./IIdentityR"
import { INullFlavorableR } from "./INullFlavorableR"
import { IPersonR } from "./IPersonR"

export interface IPatientR extends INullFlavorableR {
  id?: string
  person_attributes?: IPersonR
  person_id?: number | null
  identity_attributes?: IIdentityR
  gender: number | undefined
  birth_date: string | undefined
  birth_year: number
  organization_id: number
  addr_type?: number
  guid?: string
}
