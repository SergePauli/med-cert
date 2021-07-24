import { IContact } from "../IContact"
import { IPersonName } from "../IPersonName"

export interface IRegistration {
  email: string
  person_name_attributes: IPersonName
  password: string
  password_confirmation: string
  organization_id: string
  contacts_attributes: IContact
}
