import { v4 as uuidv4 } from "uuid"
import { makeAutoObservable } from "mobx"
import { INullFlavor } from "../INullFlavor"
import { IPerson } from "../IPerson"
import { IPersonName } from "../IPersonName"

export default class Person {
  private _id?: string | undefined
  private _fio?: IPersonName | undefined
  private _SNILS?: string | undefined
  private _nullFlavors: INullFlavor[]
  private _guid: string
  constructor(props: IPerson) {
    this._guid = props.guid || uuidv4()
    if (props.fio) this._fio = props.fio
    if (props.SNILS) this._SNILS = props.SNILS
    if (props.id) this._id = props.id
    this._nullFlavors = props.nullFlavors || []
    makeAutoObservable(this)
  }
  get fio() {
    return this._fio
  }

  set fio(fio: IPersonName | undefined) {
    this._fio = fio
  }

  nullFlavors() {
    return this._nullFlavors
  }
  setNullFlavors(nullFlavors: INullFlavor[]) {
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
  get guid() {
    return this._guid
  }
}
