import { makeAutoObservable } from "mobx"
import { v4 as uuidv4 } from "uuid"
import { INullFlavor } from "../INullFlavor"
import { IReference } from "../IReference"
import { IAddress } from "../responses/IAddress"

export default class Address {
  private _id: string
  private _streetAddressLine: string
  private _state?: IReference
  private _district?: IReference
  private _city?: IReference
  private _town?: IReference
  private _street?: IReference
  private _aoGUID?: string
  private _houseGUID?: string
  private _housenum?: string
  private _buildnum?: string
  private _strucnum?: string
  private _flat?: string
  private _postalCode?: string
  private _nullFlavors: INullFlavor[]
  constructor(props: IAddress, region = undefined as IReference | undefined) {
    this._id = props.id || uuidv4()
    this._nullFlavors = props.nullFlavors || []
    this._state = region || ({ code: props.state, name: props.addressPrints?.region } as IReference)
    this._streetAddressLine = props.streetAddressLine
    this._aoGUID = props.aoGUID
    this._houseGUID = props.houseGUID
    this._postalCode = props.postalCode
    this._district = { name: props.addressPrints?.district } as IReference
    this._city = { name: props.addressPrints?.city } as IReference
    this._town = { name: props.addressPrints?.town } as IReference
    this._housenum = props.addressPrints?.housenum
    this._buildnum = props.addressPrints?.buildnum
    this._strucnum = props.addressPrints?.strucnum
    this._flat = props.addressPrints?.flat
    makeAutoObservable(this)
  }
  get id() {
    return this._id
  }
  set id(id: string) {
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
    if (value) this._state = value
  }
  get flat() {
    return this._flat
  }
  set flat(value: string | undefined) {
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
  set housenum(value: string | undefined) {
    this._housenum = value
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
  set aoGUID(value: string | undefined) {
    this._aoGUID = value
  }
  get aoGUID() {
    return this._aoGUID
  }
  set houseGUID(value: string | undefined) {
    this._houseGUID = value
  }
  get houseGUID() {
    return this._aoGUID
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
  nullFlavors() {
    return this._nullFlavors
  }
  setNullFlavors(nullFlavors: INullFlavor[]) {
    this._nullFlavors = nullFlavors
  }
}
