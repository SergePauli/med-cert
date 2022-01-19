import { INullFlavorable } from "../INullFlavorable"

export interface IAddress extends INullFlavorable {
  id?: string
  state: string
  streetAddressLine: string
  aoGUID?: string
  houseGUID?: string
  postalCode?: string
  code?: string
  parent_guid?: string
  actual?: boolean
  house_number?: string
  struct_number?: string
  building_number?: string
  flat_number?: string
}
