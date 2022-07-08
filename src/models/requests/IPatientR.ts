import IIdentityR from "./IIdentityR"
import { INullFlavorableR } from "./INullFlavorableR"
import { IPersonR } from "./IPersonR"

export interface IPatientR extends INullFlavorableR {
  id?: string
  person_attributes?: IPersonR
  person_id?: number | null
  identity_attributes?: IIdentityR | null
  gender: number | null
  birth_date: string | null
  birth_year: number | null
  organization_id: number
  addr_type?: number
  guid?: string
}
