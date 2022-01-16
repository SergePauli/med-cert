import { IDestroyble } from "../IDestroyble"
import { IAddressR } from "./IAddressR"
import { INullFlavorableR } from "./INullFlavorableR"
import { IPersonName } from "../IPersonName"

export interface IRelatedSubjectR extends INullFlavorableR, IDestroyble {
  id: string
  family_connection: number
  addr_attributes?: IAddressR
  person_name_attributes?: IPersonName
  birthTime?: Date
}
