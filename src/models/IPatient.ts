import IIdentity from "./IIdentity"
import { INullFlavorable } from "./INullFlavorable"
import { IPerson } from "./IPerson"

export interface IPatient extends INullFlavorable {
  id?: string
  person: IPerson
  person_attributes?: IPerson
  identity?: IIdentity
  identity_attributes?: IIdentity
  gender: number | undefined
  birth_date: Date | Date[] | undefined
  birth_year: number
  organization_id: number
  addr_type?: number
  guid?: string
}
