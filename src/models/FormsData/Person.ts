import { makeAutoObservable } from "mobx"
import { INullFlavor } from "../INullFlavor"
import { IPerson } from "../IPerson"
import { IPersonName } from "../IPersonName"
import { IAddress } from "../responses/IAddress"

export default class Person {
  private _id?: string
  private _personName?: IPersonName
  private _SNILS?: string | undefined
  private _nullFlavors: INullFlavor[]
  private _address?: IAddress | undefined

  constructor(props = {} as IPerson) {
    this._personName = props.person_name
    this._SNILS = props.SNILS
    this._id = props.id
    this._address = props.address
    this._nullFlavors = props.null_flavors || []
    makeAutoObservable(this)
  }

  get fio() {
    return this._personName
  }

  set fio(fio: IPersonName | undefined) {
    this._personName = fio
  }

  get nullFlavors() {
    return this._nullFlavors
  }
  set nullFlavors(nullFlavors: INullFlavor[]) {
    this._nullFlavors = nullFlavors
  }
  get SNILS() {
    return this._SNILS
  }

  set SNILS(snils: string | undefined) {
    this._SNILS = snils
  }

  get id() {
    return this._id
  }
  get address(): IAddress | undefined {
    return this._address
  }
  set address(value: IAddress | undefined) {
    this._address = value
  }
}
