import IIdentity from "../IIdentity"
import { IPerson } from "../IPerson"

export interface IParticipant {
  id?: number
  identity?: IIdentity
  description?: string
  person?: IPerson
  receipt_date: string
  original: boolean
}
