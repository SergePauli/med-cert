import { IDestroyble } from "../IDestroyble"
import { INullFlavorableR } from "./INullFlavorableR"
import { IRelatedSubjectR } from "./IRelatedSubjectR"

export interface IChildInfoR extends INullFlavorableR, IDestroyble {
  term_pregnancy?: number
  weight?: number
  which_account?: number
  related_subject_attributes?: IRelatedSubjectR
}
