import { makeAutoObservable } from "mobx"
import FiasService from "../../services/FiasService"
import { INullFlavorR } from "../INullFlavor"
import { IReference } from "../IReference"
import { IAddressR } from "../requests/IAddressR"
import { IFiasItem } from "../responses/IFiasItem"

export default class Address {
  private _oldOne: IAddressR
  private _id?: string
  private _streetAddressLine: string
  private _state?: IReference
  private _district?: IReference
  private _city?: IReference
  private _town?: IReference
  private _street?: IReference
  private _aoGUID?: string | null
  private _houseGUID?: string | null
  private _housenum?: string | null
  private _buildnum?: string | null
  private _strucnum?: string | null
  private _flat?: string | null
  private _postalCode?: string
  private _nullFlavors: INullFlavorR[]
  private _parent?: string
  constructor(props: IAddressR) {
    this._nullFlavors =
      !!props.null_flavors_attributes && props.null_flavors_attributes.length > 0
        ? [...props.null_flavors_attributes]
        : []
    if (props.id) this._id = props.id
    this._oldOne = props
    this._streetAddressLine = props.streetAddressLine
    this._aoGUID = props.aoGUID
    this._houseGUID = props.houseGUID
    this._postalCode = props.postalCode
    this._housenum = props.house_number
    this._buildnum = props.building_number
    this._strucnum = props.struct_number
    this._flat = props.flat_number
    this._parent = props.parent_guid
    this.fetchAddressHierarchy()
    makeAutoObservable(this, undefined, { deep: false })
  }

  get oldOne(): IAddressR {
    return this._oldOne
  }

  get id() {
    return this._id
  }
  set id(id: string | undefined) {
    this._id = id
  }
  get streetAddressLine() {
    return this._streetAddressLine
  }
  set streetAddressLine(value: string) {
    this._streetAddressLine = value
  }
  get state() {
    return this._state
  }
  set state(value: IReference | undefined) {
    this._state = value
  }
  get flat() {
    return this._flat
  }
  set flat(value: string | undefined | null) {
    this._flat = value
  }

  get postalCode() {
    return this._postalCode
  }
  set postalCode(value: string | undefined) {
    this._postalCode = value
  }
  get housenum() {
    return this._housenum
  }
  set housenum(value: string | undefined | null) {
    this._housenum = value
  }
  get buildnum() {
    return this._buildnum
  }
  set buildnum(value: string | undefined | null) {
    this._buildnum = value
  }
  get strucnum() {
    return this._strucnum
  }
  set strucnum(value: string | undefined | null) {
    this._strucnum = value
  }

  set street(value: IReference | undefined) {
    this._street = value
  }
  get street() {
    return this._street
  }
  set town(value: IReference | undefined) {
    this._town = value
  }
  get town() {
    return this._town
  }
  set aoGUID(value: string | undefined | null) {
    this._aoGUID = value
  }
  get aoGUID() {
    return this._aoGUID
  }
  set houseGUID(value: string | undefined | null) {
    this._houseGUID = value
  }
  get houseGUID() {
    return this._houseGUID
  }
  set district(value: IReference | undefined) {
    this._district = value
  }
  get district() {
    return this._district
  }
  set city(value: IReference | undefined) {
    this._city = value
  }
  get city() {
    return this._city
  }

  get parent() {
    return this._parent
  }
  get nullFlavors() {
    return this._nullFlavors
  }

  set nullFlavors(nullFlavors: INullFlavorR[]) {
    this._nullFlavors = nullFlavors
  }

  // получение копии массива заполнителей из Observable.array
  null_flavors_attributes(): INullFlavorR[] {
    return this._nullFlavors.map((el) => {
      return { ...el }
    })
  }

  //рекурсивный парсинг структуры адресного объекта
  parseFiasItem(fiasItem: IFiasItem) {
    switch (fiasItem.level) {
      case "building":
        this._streetAddressLine = fiasItem.streetAddressLine
        break
      case "Street":
        this._street = { code: fiasItem.AOGUID, name: `${fiasItem.name} ${fiasItem.shortname}` }
        break
      case "Town":
      case "RailWayObject":
        this._town = { code: fiasItem.AOGUID, name: `${fiasItem.name} ${fiasItem.shortname}` }
        break
      case "City":
        this._city = { code: fiasItem.AOGUID, name: `${fiasItem.name} ${fiasItem.shortname}` }
        break
      case "District":
        this._district = { code: fiasItem.AOGUID, name: `${fiasItem.name} ${fiasItem.shortname}` }
        break
      case "Region":
        if (fiasItem.code) {
          const code = fiasItem.code.slice(0, 2)
          this._state = { code: code, name: `${fiasItem.name}` }
        }
        break
      default:
        console.log("invalid fiasItem.level", fiasItem)
        break
    }
    if (fiasItem.parent) this.parseFiasItem(fiasItem.parent)
  }
  // Получить всю ФИАС структуру адресного объекта по AOGUID
  fetchAddressHierarchy() {
    if (!this._aoGUID) return
    FiasService.getChildItems(this._aoGUID, this._houseGUID ? "building" : "", "", "1")
      .then((response) => {
        if (response.data.data)
          response.data.data.forEach((item) => {
            this.parseFiasItem(item)
          })
      })
      .catch((reason) => console.log(reason))
  }
}
