import { IAddressable } from "./common/IAddresable"
import { IContact } from "./IContact"
import { INullFlavorable } from "./INullFlavorable"
import { IPersonName } from "./IPersonName"

export interface IPerson extends INullFlavorable, IAddressable {
  id?: string
  person_name?: IPersonName
  person_name_attributes?: IPersonName
  SNILS?: string
  contacts?: IContact[]
  contacts_attributes?: IContact[]
}
