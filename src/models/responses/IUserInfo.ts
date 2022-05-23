import { IContact } from "../IContact"
import { IPersonName } from "../IPersonName"

export interface IUserInfo {
  id: number
  roles: string
  person_name: IPersonName
  organization: { id: number; name: string; sm_code: string; oid: string }
  contacts: IContact[]
}
