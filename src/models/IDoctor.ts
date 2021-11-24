import { IContact } from "./IContact"
import { INullFlavorable } from "./INullFlavorable"
import { IPersonName } from "./IPersonName"
import { IAddress } from "./responses/IAddress"

export interface IDoctor extends INullFlavorable {
  id?: string
  person_name?: IPersonName
  SNILS?: string
  position?: { id: number; name: string }
  address?: IAddress
  organization?: { id: number; name: string }
  contacts?: IContact[]
}
