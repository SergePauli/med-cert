import { INullFlavorable } from "../INullFlavorable"
import { AddressPrint } from "./IAddressPrint"

export interface IAddress extends INullFlavorable {
  id?: string
  state: string
  streetAddressLine: string
  aoGUID?: string
  houseGUID?: string
  postalCode?: string
  addressPrints?: AddressPrint
}
