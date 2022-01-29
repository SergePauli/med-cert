import { IDoctor } from "../IDoctor"

export interface IAuthenticator {
  id: number
  time: string
  doctor: IDoctor
}
