import { makeAutoObservable } from "mobx"
import Address from "../models/FormsData/Address"
import { checkFieldNullFlavor, INullFlavor } from "../models/INullFlavor"
import { IReference } from "../models/IReference"
import { DEFAULT_ADDRESS, IAddress } from "../models/responses/IAddress"
import { IFiasItem } from "../models/responses/IFiasItem"
import FiasService from "../services/FiasService"
import { HOME_REGION_CODE } from "../utils/defaults"
import { removeEmpty } from "../utils/functions"
export default class AddressStore {
  private _address: Address
  private _isLoding: boolean
  private _history: any
  private _regionsOptions: IReference[] | undefined
  private _fiasOptions: IFiasItem[] | undefined
  private _dialogVisible: boolean
  private _manualMode: boolean
  private _onAddrComplete?: (() => void) | undefined

  constructor() {
    this._isLoding = false
    this._address = new Address(DEFAULT_ADDRESS)
    this._dialogVisible = false
    this._manualMode = false
    makeAutoObservable(this)
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
    } finally {
      this._isLoding = false
    }
  }

  // Returned full streetAddressLine include flat and postal code to save in IAddress
  // Возвращает полный строковый адрес, включая квартиру и почтовы код,
  // обычно не используемые в строке поиска, для сохранения в POJO

  streetAddressLine(): string {
    const addr = this._address
    return `${addr.streetAddressLine}${addr.flat ? ", " + addr.flat : ""}${
      addr.postalCode ? ", " + addr.postalCode : ""
    }`
  }
  createNullFlavors(): INullFlavor[] {
    const addr = this._address
    //check postalcode
    checkFieldNullFlavor("postalCode", addr.postalCode, addr.nullFlavors)
    //check aoGUID
    checkFieldNullFlavor("aoGUID", addr.aoGUID, addr.nullFlavors)
    //check houseGUID
    checkFieldNullFlavor("houseGUID", addr.houseGUID, addr.nullFlavors)
    return addr.null_flavors_attributes()
  }
  // Check address for FIAS requarens
  isNotStrictly(): boolean {
    const addr = this._address
    return !addr.aoGUID || !addr.houseGUID || !addr.postalCode
  }
  // Returned POJO address data
  // Возвращает POJO объект адреса
  addressProps(): IAddress {
    const addr = this._address
    const _result = {
      id: addr.id,
      state: addr.state?.code,
      streetAddressLine: this.streetAddressLine(),
      aoGUID: addr.aoGUID,
      houseGUID: addr.houseGUID,
      postalCode: addr.postalCode,
      house_number: addr.housenum,
      struct_number: addr.strucnum,
      building_number: addr.buildnum,
      flat_number: addr.flat,
      parent_guid: addr.parent,
      null_flavors_attributes: [...this.createNullFlavors()],
    } as IAddress
    return removeEmpty(_result)
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
  get dialogVisible(): boolean {
    return this._dialogVisible
  }
  set dialogVisible(value: boolean) {
    this._dialogVisible = value
  }

  get manualMode(): boolean {
    return this._manualMode
  }
  set manualMode(value: boolean) {
    this._manualMode = value
  }

  get onAddrComplete(): (() => void) | undefined {
    return this._onAddrComplete
  }
  set onAddrComplete(value: (() => void) | undefined) {
    this._onAddrComplete = value
  }
}
