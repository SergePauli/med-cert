import { IContact } from "./IContact"
import { INullFlavorable } from "./INullFlavorable"
import { IPersonName } from "./IPersonName"
import { IAddress } from "./responses/IAddress"

export interface IPerson extends INullFlavorable {
  id?: string
  person_name?: IPersonName
  SNILS?: string
  address?: IAddress
  contacts?: IContact[]
}
