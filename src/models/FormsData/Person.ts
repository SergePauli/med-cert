import { makeAutoObservable } from "mobx"
import { NULL_FLAVOR_IDX } from "../../utils/defaults"
import { ISerializable } from "../common/ISerializabale"
import { IContact } from "../IContact"
import { INullFlavorR } from "../INullFlavor"
import { IPerson } from "../IPerson"
import { IPersonName } from "../IPersonName"
import { IAddressR } from "../requests/IAddressR"
import { IPersonR } from "../requests/IPersonR"

export default class Person implements ISerializable {
  private _id?: string
  private _personName?: IPersonName
  private _SNILS?: string | undefined
  private _nullFlavors: INullFlavorR[]
  private _address?: IAddressR | undefined
  private _contacts: IContact[]

  constructor(props = {} as IPerson) {
    this._personName = props.person_name
    this._SNILS = props.SNILS
    this._id = props.id
    this._address = {
      ...props.address,
      null_flavors_attributes:
        props.address?.null_flavors?.map((item) => {
          return { ...item, code: NULL_FLAVOR_IDX[item.code] } as INullFlavorR
        }) || [],
    } as IAddressR
    this._nullFlavors =
      props.null_flavors?.map((item) => {
        return { ...item, code: NULL_FLAVOR_IDX[item.code] } as INullFlavorR
      }) || []
    this._contacts = props.contacts || []
    makeAutoObservable(this, undefined, { deep: false })
  }

  getAttributes(): IPersonR {
    let _person = {} as IPersonR
    if (this._id) _person.id = this._id
    if (this._SNILS) _person.SNILS = this._SNILS
    if (this._address) _person.address_attributes = { ...this._address }
    if (this._contacts.length > 0) _person.contacts_attributes = [...this._contacts]
    if (this._nullFlavors.length > 0) _person.null_flavors_attributes = this.null_flavors_attributes()
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
  set nullFlavors(nullFlavors: INullFlavorR[]) {
    this._nullFlavors = nullFlavors
  }

  // получение копии массива заполнителей из Observable.array
  null_flavors_attributes() {
    return this._nullFlavors.map((el) => {
      return { ...el }
    })
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
  get address(): IAddressR | undefined {
    return this._address
  }
  set address(value: IAddressR | undefined) {
    this._address = value
  }
  get contacts(): IContact[] {
    return this._contacts
  }
  set contacts(value: IContact[]) {
    this._contacts = value
  }
}
