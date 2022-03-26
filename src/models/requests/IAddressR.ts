import { HOME_REGION_CODE } from "../../utils/defaults"
import { IDestroyble } from "../IDestroyble"
import { INullFlavorableR } from "./INullFlavorableR"

export interface IAddressR extends INullFlavorableR, IDestroyble {
  id?: string
  state: string
  streetAddressLine: string
  aoGUID?: string | null
  houseGUID?: string | null
  postalCode?: string
  code?: string
  parent_guid?: string
  actual?: boolean
  house_number?: string | null
  struct_number?: string | null
  building_number?: string | null
  flat_number?: string | null
}
export const DEFAULT_ADDRESS = { state: HOME_REGION_CODE, streetAddressLine: "" } as IAddressR
