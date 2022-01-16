import { IAddressable } from "../common/IAddresable"
import { IContact } from "../IContact"
import { IPersonName } from "../IPersonName"
import { INullFlavorableR } from "./INullFlavorableR"

export interface IPersonR extends INullFlavorableR, IAddressable {
  id?: string
  person_name_attributes?: IPersonName
  SNILS?: string
  contacts_attributes?: IContact[]
}
