import { makeAutoObservable } from "mobx"
import { ISerializable } from "../common/ISerializabale"
import { IContact } from "../IContact"
import { INullFlavor } from "../INullFlavor"
import { IPerson } from "../IPerson"
import { IPersonName } from "../IPersonName"
import { IAddress } from "../responses/IAddress"

export default class Person implements ISerializable {
  private _id?: string
  private _personName?: IPersonName
  private _SNILS?: string | undefined
  private _nullFlavors: INullFlavor[]
  private _address?: IAddress | undefined
  private _contacts: IContact[]

  constructor(props = {} as IPerson) {
    this._personName = props.person_name || props.person_name_attributes
    this._SNILS = props.SNILS
    this._id = props.id
    this._address = props.address || props.address_attributes
    this._nullFlavors = props.null_flavors || props.null_flavors_attributes || []
    this._contacts = props.contacts || props.contacts_attributes || []
    makeAutoObservable(this, undefined, { deep: false })
  }

  getAttributes(): IPerson {
    let _person = {} as IPerson
    if (this._id) _person.id = this._id
    if (this._SNILS) _person.SNILS = this._SNILS
    if (this._address) _person.address_attributes = { ...this._address }
    if (this._contacts.length > 0) _person.contacts_attributes = [...this._contacts]
    if (this._nullFlavors.length > 0) _person.null_flavors_attributes = [...this._nullFlavors]
    if (this._personName) _person.person_name_attributes = { ...this._personName }
    return _person
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
  get contacts(): IContact[] {
    return this._contacts
  }
  set contacts(value: IContact[]) {
    this._contacts = value
  }
}
