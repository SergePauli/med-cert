import Address from "../models/FormsData/Address"
import { IReference } from "../models/IReference"
import { IFiasItem } from "../models/responses/IFiasItem"
import FiasService from "../services/FiasService"
export const HOME_REGION_CODE = "28"
export default class AddressStore {
  private _address: Address
  private _isLoding: boolean
  private _history: any
  private _regionsOptions: IReference[] | undefined
  private _fiasOptions: IFiasItem[] | undefined

  constructor() {
    this._isLoding = false
    this.fetchRegionOptions()
    this._address = new Address({ state: HOME_REGION_CODE, streetAddressLine: "", nullFlavors: [] })
  }
  fetchRegionOptions() {
    FiasService.getRegions().then((response) => {
      this._regionsOptions = response.data.data.map((item) => {
        return { code: item.code, name: item.streetAddressLine } as IReference
      })
    })
  }
  searchBar(query: string) {
    FiasService.searchBar(query).then((response) => {
      this._fiasOptions = response.data.data
    })
  }
  defaultRegion() {
    return this._regionsOptions?.find((item) => item.code.startsWith(HOME_REGION_CODE))
  }
  set history(history: any) {
    this._history = history
  }
  get history() {
    return this._history
  }

  set isLoading(isLoding: boolean) {
    this._isLoding = isLoding
  }
  get isLoading() {
    return this._isLoding
  }
  get address() {
    return this._address
  }
  set address(value: Address) {
    this._address = value
  }
  get regionsOptions() {
    return this._regionsOptions
  }
  get fiasOptions() {
    return this._fiasOptions
  }
}
