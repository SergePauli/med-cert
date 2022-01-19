import { INullFlavorable } from "./INullFlavorable"
import { IPersonName } from "./IPersonName"
import { IAddress } from "./responses/IAddress"

export interface IRelatedSubject extends INullFlavorable {
  id: number
  guid: string
  family_connection: number
  addr?: IAddress
  person_name?: IPersonName
  birthTime?: string
}
