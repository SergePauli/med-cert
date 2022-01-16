import { IDestroyble } from "../IDestroyble"

export interface IAuthenticatorR extends IDestroyble {
  id?: number
  time?: Date
  doctor_id?: number
}
