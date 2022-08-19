import { makeAutoObservable } from "mobx"
import { v4 as uuidv4 } from "uuid"
import { ITrackable } from "../common/ITraсkable"
import { IDoctor } from "../IDoctor"
import { IReferenceId } from "../IReference"
import { IDoctorR } from "../requests/IDoctorR"
import Person from "./Person"

export default class Doctor implements ITrackable<IDoctor> {
  private _id?: number
  private _person: Person
  private _position?: IReferenceId | undefined
  private _organization?: IReferenceId | undefined
  private _department?: string | null | undefined
  private _office?: string | null | undefined
  private _guid: string
  private _oldOne?: IDoctor | undefined

  constructor(props = {} as IDoctor) {
    this._oldOne = props
    this._id = props.id
    this._guid = props.guid || uuidv4()
    this._person = props.person ? new Person(props.person) : new Person()
    this._organization = props.organization || undefined
    this._position = props.position || undefined
    this._department = props.department
    this._office = props.office
    makeAutoObservable(this, undefined, { deep: false })
  }

  get oldOne(): IDoctor | undefined {
    return this._oldOne
  }

  getAttributes(): IDoctorR {
    let _doctor = { guid: this._guid } as IDoctorR
    if (this._id) _doctor.id = this._id
    if (this._person) _doctor.person_attributes = this._person.getAttributes()
    if (this._organization) _doctor.organization_id = this._organization.id
    if (this._position) _doctor.position_id = this._position.id
    if (this._department) _doctor.department = this._department
    else if (this.oldOne && !!this.oldOne.department) _doctor.department = null
    if (this._office) _doctor.office = this._office
    else if (this.oldOne && !!this.oldOne.office) _doctor.office = null
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
  get department(): string | null | undefined {
    return this._department
  }
  set department(value: string | null | undefined) {
    this._department = value
  }
  get office(): string | null | undefined {
    return this._office
  }
  set office(value: string | null | undefined) {
    this._office = value
  }
}
