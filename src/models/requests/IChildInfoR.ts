import { IDestroyble } from "../IDestroyble"
import { IAddressR } from "./IAddressR"
import { INullFlavorableR } from "./INullFlavorableR"
import { IRelatedSubjectR } from "./IRelatedSubjectR"

export interface IChildInfoR extends INullFlavorableR, IDestroyble {
  id?: number
  guid: string
  term_pregnancy?: number | null
  weight?: number | null
  which_account?: number | null
  related_subject_attributes?: IRelatedSubjectR
  address_attributes?: IAddressR
}
