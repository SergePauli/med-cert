import { INullFlavorable } from "./INullFlavorable"
import { IPerson } from "./IPerson"

export interface IPatient extends INullFlavorable {
  id?: string
  person: IPerson
  gender: number
  birth_date: Date
  birth_year: number
  birth_month: number
  provider_organization: string
  addr_type: number
  guid: string
}
