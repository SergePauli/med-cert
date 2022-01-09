import { HOME_REGION_CODE } from "../../utils/defaults"
import { IDestroyble } from "../IDestroyble"
import { INullFlavorable } from "../INullFlavorable"

export interface IAddress extends INullFlavorable, IDestroyble {
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
export const DEFAULT_ADDRESS = { state: HOME_REGION_CODE, streetAddressLine: "" } as IAddress
