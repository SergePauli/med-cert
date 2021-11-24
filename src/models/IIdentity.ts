import { INullFlavorable } from "./INullFlavorable"

export default interface IIdentity extends INullFlavorable {
  id?: string
  identityCardType: string
  series?: string
  number: string
  issueOrgName: string
  issueOrgCode?: string
  issueOrgDate: Date
  parentGUID: string
}
