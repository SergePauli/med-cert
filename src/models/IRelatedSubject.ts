import { IDestroyble } from "./IDestroyble"
import { INullFlavorable } from "./INullFlavorable"
import { IPersonName } from "./IPersonName"
import { IAddress } from "./responses/IAddress"

export interface IRelatedSubject extends INullFlavorable, IDestroyble {
  id: string
  family_connection: number
  addr?: IAddress
  addr_attributes?: IAddress
  person_name?: IPersonName
  person_name_attributes?: IPersonName
  birthTime?: Date
}
