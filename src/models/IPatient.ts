import IIdentity from "./IIdentity"
import { INullFlavorable } from "./INullFlavorable"
import { IPerson } from "./IPerson"
import { IAddress } from "./responses/IAddress"

export interface IPatient extends INullFlavorable {
  id?: string
  person: IPerson
  identity?: IIdentity
  gender: number | undefined
  birth_date: Date | Date[] | undefined
  birth_year: number
  birth_month: number
  provider_organization: string
  addr_type: number
  address?: IAddress
  guid: string
}
