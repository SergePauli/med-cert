import { INullFlavorable } from "./INullFlavorable"
import { IRelatedSubject } from "./IRelatedSubject"

export interface IChildInfo extends INullFlavorable {
  term_pregnancy?: number
  weight?: number
  which_account?: number
  related_subject?: IRelatedSubject
}
