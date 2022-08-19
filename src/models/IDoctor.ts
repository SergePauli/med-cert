import { INullFlavorable } from "./INullFlavorable"
import { IPerson } from "./IPerson"
import { IPersonName } from "./IPersonName"

export interface IDoctor extends INullFlavorable {
  id?: number
  person: IPerson
  person_name?: IPersonName
  position?: { id: number; name: string }
  organization?: { id: number; name: string }
  department?: string
  office?: string
  guid: string
}
