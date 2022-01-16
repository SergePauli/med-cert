import { IDestroyble } from "../IDestroyble"
import { INullFlavorableR } from "./INullFlavorableR"

export default interface IIdentity extends INullFlavorableR, IDestroyble {
  id?: string
  identity_card_type_id: number
  series?: string
  number: string
  issueOrgName: string
  issueOrgCode?: string
  issueDate: Date
  parentGUID: string
}
