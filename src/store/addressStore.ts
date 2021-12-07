import Address from "../models/FormsData/Address"
import { IReference } from "../models/IReference"
import { IAddress } from "../models/responses/IAddress"
import { IFiasItem } from "../models/responses/IFiasItem"
import FiasService from "../services/FiasService"
import { HOME_REGION_CODE } from "../utils/defaults"
export default class AddressStore {
  private _address: Address
  private _isLoding: boolean
  private _history: any
  private _regionsOptions: IReference[] | undefined
  private _fiasOptions: IFiasItem[] | undefined

  constructor() {
    this._isLoding = false
    this._address = new Address({ state: HOME_REGION_CODE, streetAddressLine: "", nullFlavors: [] })
  }

  fetchRegionOptions() {
    const _regions = localStorage.getItem("Regions")
    if (_regions) {
      this._regionsOptions = JSON.parse(_regions) as IReference[]
      this.defaultRegion()
    } else
      FiasService.getRegions()
        .then((response) => {
          this._regionsOptions = response.data.data.map((item) => {
            return { code: item.code?.substr(0, 2), name: item.streetAddressLine } as IReference
          })
          localStorage.setItem("Regions", JSON.stringify(this._regionsOptions))
          this.defaultRegion()
        })
        .finally(() => (this._isLoding = false))
  }

  async searchBar(query: string, regionID = HOME_REGION_CODE as string) {
    this._isLoding = true
    try {
      const response = await FiasService.searchBar(query, regionID)
      if (response.data.data) this._fiasOptions = response.data.data
      else this._fiasOptions = []
      return this._fiasOptions
    } catch (e) {
      console.log(e)
      return []
    } finally {
      this._isLoding = false
    }
  }
  defaultRegion() {
    return this._regionsOptions?.find((item) => item.code === HOME_REGION_CODE)
  }
  async getChildItems(parent: string, level: string, query = "") {
    this._isLoding = true
    try {
      const response = await FiasService.getChildItems(parent, level, query)
      if (response.data.data)
        this._fiasOptions = response.data.data.map((item) => {
          if (item.level !== "building") item.name = `${item.name} ${item.shortname}`
          return item
        })
      else this._fiasOptions = []
      return this._fiasOptions
    } catch (e) {
      console.log(e)
      return []
    } finally {
      this._isLoding = false
    }
  }

  // Returned POJO address data
  // Возвращает POJO объект адреса
  addressProps(): IAddress {
    const addr = this._address
    const result = {
      id: addr.id,
      state: addr.state?.code,
      streetAddressLine: `${addr.streetAddressLine}${addr.flat ? ", " + addr.flat : ""}${
        addr.postalCode ? ", " + addr.postalCode : ""
      }`,
      aoGUID: addr.aoGUID,
      houseGUID: addr.houseGUID,
      postalCode: addr.postalCode,
      house_number: addr.housenum,
      struct_number: addr.strucnum,
      building_number: addr.buildnum,
      flat_number: addr.flat,
      parent_guid: addr.parent,
      //nullFlavors: addr.nullFlavors(),
    } as IAddress

    return result
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
  clear() {
    if (this._address === undefined) return
    this._address.postalCode = undefined
    this._address.district = undefined
    this._address.city = undefined
    this._address.houseGUID = undefined
    this._address.aoGUID = undefined
    this._address.street = undefined
    this._address.town = undefined
    this._address.housenum = undefined
    this._address.buildnum = undefined
    this._address.strucnum = undefined
    this._address.streetAddressLine = this._address.state?.name + ", " || ""
  }
}
