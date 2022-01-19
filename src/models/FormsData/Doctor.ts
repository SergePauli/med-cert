import { makeAutoObservable } from "mobx"
import { v4 as uuidv4 } from "uuid"
import { ISerializable } from "../common/ISerializabale"
import { IDoctor } from "../IDoctor"
import { IReferenceId } from "../IReference"
import { IDoctorR } from "../requests/IDoctorR"
import Person from "./Person"

export default class Doctor implements ISerializable {
  private _id?: number
  private _person: Person
  private _position?: IReferenceId | undefined
  private _organization?: IReferenceId | undefined
  private _guid: string
  constructor(props = {} as IDoctor) {
    this._id = props.id
    this._guid = props.guid || uuidv4()
    this._person = props.person ? new Person(props.person) : new Person()
    this._organization = props.organization || undefined
    this._position = props.position || undefined
    makeAutoObservable(this, undefined, { deep: false })
  }
  getAttributes(): IDoctorR {
    let _doctor = { guid: this._guid } as IDoctorR
    if (this._id) _doctor.id = this._id
    if (this._person) _doctor.person_attributes = this._person.getAttributes()
    if (this._organization) _doctor.organization_id = this._organization.id
    if (this._position) _doctor.position_id = this._position.id
    return _doctor
  }
  get id() {
    return this._id
  }
  set id(id: number | undefined) {
    this._id = id
  }
  get person() {
    return this._person
  }

  get guid() {
    return this._guid
  }
  get position(): IReferenceId | undefined {
    return this._position
  }
  set position(value: IReferenceId | undefined) {
    this._position = value
  }
  get organization(): IReferenceId | undefined {
    return this._organization
  }
  set organization(value: IReferenceId | undefined) {
    this._organization = value
  }
}
