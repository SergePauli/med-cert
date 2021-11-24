import { IContact } from "../IContact"
import { IPersonName } from "../IPersonName"
import { IReference } from "../IReference"

export interface IUserInfo {
  id: number
  roles: string
  person_name: IPersonName
  organization: { id: number; name: string }
  contacts: IContact[]
}
