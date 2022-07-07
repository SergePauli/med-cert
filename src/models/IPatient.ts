import IIdentity from "./IIdentity"
import { INullFlavorable } from "./INullFlavorable"
import { IPerson } from "./IPerson"

export interface IPatient extends INullFlavorable {
  id?: string
  person: IPerson
  identity?: IIdentity
  gender: number | undefined
  birth_date: string | undefined
  birth_year: number | null
  organization_id: number
  addr_type?: number
  guid?: string
}
