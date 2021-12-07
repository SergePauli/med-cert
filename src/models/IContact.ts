import { IDestroyble } from "./IDestroyble"

export interface IContact extends IDestroyble {
  id?: string
  parent_guid?: string
  telcom_value: string
  telcom_use?: string
  main?: boolean
}
