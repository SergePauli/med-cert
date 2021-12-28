import { v4 as uuidv4 } from "uuid"
import { makeAutoObservable } from "mobx"
import { INullFlavor } from "../INullFlavor"
import { IPerson } from "../IPerson"
import { IPersonName } from "../IPersonName"

export default class Person {
  private _id?: string
  private _personName?: IPersonName | undefined
  private _SNILS?: string | undefined
  private _nullFlavors: INullFlavor[]

  constructor(props: IPerson) {
    if (props.person_name) this._personName = props.person_name
    if (props.SNILS) this._SNILS = props.SNILS
    this._id = props.id || uuidv4()
    this._nullFlavors = props.null_flavors || []
    makeAutoObservable(this)
  }

  get fio() {
    return this._personName
  }

  set fio(fio: IPersonName | undefined) {
    this._personName = fio
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
}
