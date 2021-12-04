import { INullFlavorable } from "./INullFlavorable"
import { IPerson } from "./IPerson"

export interface IDoctor extends INullFlavorable {
  id?: number
  person: IPerson
  position?: { id: number; name: string }
  organization?: { id: number; name: string }
  guid: string
}
