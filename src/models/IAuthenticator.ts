import { IReferenceId } from "./IReference"

export interface IAuthenticator {
  id?: string
  time?: Date
  doctor?: IReferenceId
}
