import { INullFlavorable } from "./INullFlavorable"

export default interface IIdentity extends INullFlavorable {
  id?: string
  identity_card_type_id: number
  series?: string
  number: string
  issueOrgName: string
  issueOrgCode?: string
  issueOrgDate: Date
  parentGUID: string
}
