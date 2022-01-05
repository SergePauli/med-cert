import { IDestroyble } from "./IDestroyble"
import { INullFlavorable } from "./INullFlavorable"
import { IRelatedSubject } from "./IRelatedSubject"

export interface IChildInfo extends INullFlavorable, IDestroyble {
  term_pregnancy?: number
  weight?: number
  which_account?: number
  related_subject?: IRelatedSubject
  related_subject_attributes?: IRelatedSubject
}
