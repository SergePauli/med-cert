import { IDestroyble } from "./IDestroyble"
import { IReferenceId } from "./IReference"

export interface IAuthenticator extends IDestroyble {
  id?: string
  time?: Date
  doctor?: IReferenceId
  doctor_id?: number
}
