import { makeAutoObservable } from "mobx"
import { v4 as uuidv4 } from "uuid"
import { INullFlavor } from "../INullFlavor"
import { IPatient } from "../IPatient"
import Address from "./Address"
import Identity from "./Identity"
import Person from "./Person"

export default class Patient {
  private _id?: string | undefined
  private _person: Person
  private _gender?: number | undefined
  private _birth_date: Date | Date[] | undefined
  private _birth_year?: number
  private _provider_organization?: string
  private _addr_type?: number
  private _address?: Address
  private _guid?: string
  private _identity?: Identity
  private _nullFlavors: INullFlavor[]
  constructor(props: IPatient) {
    this._guid = props.guid || uuidv4()
    this._person = new Person(props.person)
    if (props.gender) this._gender = props.gender
    if (props.addr_type) this._addr_type = props.addr_type
    if (props.birth_date) this._birth_date = props.birth_date
    if (props.id) this._id = props.id
    if (props.birth_year) this._birth_year = props.birth_year
    if (props.identity) {
      props.identity.parentGUID = props.identity.parentGUID || this._guid
      this._identity = new Identity(props.identity)
    }
    this._nullFlavors = props.nullFlavors || []
    if (props.address) this._address = new Address(props.address)
    makeAutoObservable(this)
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
  get gender() {
    return this._gender
  }
  set gender(gender: number | undefined) {
    this._gender = gender
  }
  get birth_date() {
    return this._birth_date
  }
  set birth_date(birth_date: Date | Date[] | undefined) {
    this._birth_date = birth_date
  }
  get guid() {
    return this._guid
  }
  set guid(guid: string | undefined) {
    this._guid = guid
  }
  nullFlavors() {
    return this._nullFlavors
  }
  setNullFlavors(nullFlavors: INullFlavor[]) {
    this._nullFlavors = nullFlavors
  }
  get addr_type() {
    return this._addr_type
  }
  set addr_type(addr_type: number | undefined) {
    this._addr_type = addr_type
  }
  get provider_organization() {
    return this._provider_organization
  }
  set provider_organization(provider_organization: string | undefined) {
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
  get address() {
    return this._address
  }
  set address(value: Address | undefined) {
    this._address = value
  }
}
