import { IContact } from "./IContact"
import { IAddressR } from "./requests/IAddressR"

export interface IOrganization {
  create_date: string
  delete_date: string | null
  delete_reason: string | null
  guid: string
  id: number
  license: string
  license_data: string
  modify_date: string
  name: string | null
  name_full: string | null
  oid: string
  okpo: string | null
  organization_type: number
  osp_oid: string | null
  parent_id: number | null
  parent_oid: string | null
  address: IAddressR
  contacts: IContact[]
}
