import { INullFlavorable } from "./INullFlavorable"
import { IPersonName } from "./IPersonName"

export interface IPerson extends INullFlavorable {
  id?: string
  fio: IPersonName
  SNILS?: string
}
