import { IPersonName } from "./IPersonName"
export interface IAuthenticator {
  id?: string
  time?: Date
  doctor?: { id: string; person_name: IPersonName }
}
