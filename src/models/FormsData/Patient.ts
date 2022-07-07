import { makeAutoObservable } from "mobx"
import { v4 as uuidv4 } from "uuid"
import { NULL_FLAVOR_IDX } from "../../utils/defaults"
import { ISerializable } from "../common/ISerializabale"
import { INullFlavorR } from "../INullFlavor"
import { IPatient } from "../IPatient"
import IIdentityR from "../requests/IIdentityR"
import { IPatientR } from "../requests/IPatientR"
import Identity from "./Identity"
import Person from "./Person"
export const MAIN_REGISTRATION_ADDRESS = 1
export default class Patient implements ISerializable {
  private _id?: string | undefined
  private _person?: Person
  private _gender?: number | undefined
  private _birth_date: Date | undefined
  private _birth_year?: number
  private _provider_organization?: number
  private _addrType?: number
  private _guid: string
  private _identity?: Identity
  private _nullFlavors: INullFlavorR[]
  private _oldOne?: IPatient
  constructor(props = {} as IPatient) {
    this._guid = props.guid || uuidv4()
    this._oldOne = { ...props }
    if (props.person) this._person = new Person(props.person)
    this._provider_organization = props.organization_id
    if (props.gender) this._gender = props.gender
    this._addrType = props.addr_type || MAIN_REGISTRATION_ADDRESS
    if (props.birth_date) this._birth_date = new Date(props.birth_date)
    if (props.id) this._id = props.id
    if (props.birth_year) this._birth_year = props.birth_year
    if (props.identity) this._identity = new Identity(props.identity)
    this._nullFlavors =
      props.null_flavors?.map((item) => {
        return { ...item, code: NULL_FLAVOR_IDX[item.code] } as INullFlavorR
      }) || []

    makeAutoObservable(this, undefined, { deep: false })
  }
  getAttributes(): IPatientR {
    let _patient = { guid: this._guid } as IPatientR
    if (this._id) _patient.id = this.id
    if (this._addrType) _patient.addr_type = this._addrType
    if (!!this._birth_date) _patient.birth_date = this._birth_date.toDateString()
    else _patient.birth_date = null
    if (!!this._birth_year) _patient.birth_year = this._birth_year
    else _patient.birth_year = null
    if (this._gender) _patient.gender = this._gender
    else _patient.gender = null
    if (this._identity) _patient.identity_attributes = this._identity.getAttributes()
    else if (this._oldOne?.identity?.id)
      _patient.identity_attributes = { id: this._oldOne.identity.id, _destroy: "1" } as IIdentityR
    if (this._provider_organization) _patient.organization_id = this._provider_organization
    if (this._person) _patient.person_attributes = this._person.getAttributes()
    else _patient.person_id = null
    if (this.nullFlavors.length > 0) _patient.null_flavors_attributes = this.null_flavors_attributes()
    return _patient
  }
  get id() {
    return this._id
  }
  set id(id: string | undefined) {
    this._id = id
  }
  get person() {
    return this._person
  }

  set person(value: Person | undefined) {
    this._person = value
  }

  get gender() {
    return this._gender
  }
  set gender(gender: number | undefined) {
    this._gender = gender
  }
  get birth_date() {
    return this._birth_date
  }
  set birth_date(birth_date: Date | undefined) {
    this._birth_date = birth_date
  }
  get guid() {
    return this._guid
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

  get addr_type() {
    return this._addrType
  }
  set addr_type(addr_type: number | undefined) {
    this._addrType = addr_type
  }
  get provider_organization() {
    return this._provider_organization
  }
  set provider_organization(provider_organization: number | undefined) {
    this._provider_organization = provider_organization
  }
  get birth_year() {
    return this._birth_year
  }
  set birth_year(birth_year: number | undefined) {
    this._birth_year = birth_year
  }
  get identity() {
    return this._identity
  }
  set identity(identity: Identity | undefined) {
    this._identity = identity
  }

  setBirthDay(value: Date | undefined, isYear: boolean) {
    if (value && !isYear) {
      if (this._birth_date === undefined)
        this.nullFlavors = this.nullFlavors.filter((element) => element.parent_attr !== "birth_date")
      this.birth_date = value
      this.birth_year = undefined
    } else if (value && isYear) {
      if (this.birth_date === undefined)
        this.nullFlavors = this.nullFlavors.filter((element) => element.parent_attr !== "birth_date")
      this.birth_date = value
      this.birth_year = (this.birth_date as Date).getFullYear()
    } else {
      this.birth_date = undefined
      this.birth_year = undefined
    }
  }
}
