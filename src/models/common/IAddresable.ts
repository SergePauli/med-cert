import { IAddressR } from "../requests/IAddressR"
import { IAddress } from "../responses/IAddress"

export interface IAddressable {
  address?: IAddress
  address_attributes?: IAddressR
}
