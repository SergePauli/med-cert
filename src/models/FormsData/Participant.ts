import { makeAutoObservable } from "mobx"
import { ISerializable } from "../common/ISerializabale"
import { IParticipantR } from "../requests/IParticipintR"
import { IParticipant } from "../responses/IParticipant"
import Identity from "./Identity"
import Person from "./Person"

export default class Participant implements ISerializable {
  private _id?: number | undefined
  private _person: Person
  private _receiptDate: Date
  private _description?: string | undefined
  private _identity?: Identity | undefined
  private _original: boolean
  private _oldOne?: IParticipant | undefined

  constructor(props = {} as IParticipant) {
    this._oldOne = { ...props }
    if (props.person) this._person = new Person(props.person)
    else this._person = new Person()
    if (props.receipt_date) this._receiptDate = new Date(props.receipt_date)
    else this._receiptDate = new Date()
    if (props.identity) this._identity = new Identity(props.identity)
    this._id = props.id
    this._description = props.description
    this._original = props.original === undefined ? true : props.original
    makeAutoObservable(this, undefined, { deep: false })
  }
  getAttributes() {
    const _pr = {} as IParticipantR
    if (this._id) _pr.id = this._id
    _pr.description = this._description
    _pr.original = this._original
    _pr.receipt_date = this._receiptDate?.toDateString()
    if (this._person) _pr.person_attributes = this._person.getAttributes()
    if (this._identity) _pr.identity_attributes = this._identity.getAttributes()
    return _pr
  }
  get oldOne(): IParticipant | undefined {
    return this._oldOne
  }
  get original(): boolean {
    return this._original
  }
  set original(value: boolean) {
    this._original = value
  }
  get identity(): Identity | undefined {
    return this._identity
  }
  set identity(value: Identity | undefined) {
    this._identity = value
  }
  get description(): string | undefined {
    return this._description
  }
  set description(value: string | undefined) {
    this._description = value
  }
  get receiptDate(): Date {
    return this._receiptDate
  }
  set receiptDate(value: Date) {
    this._receiptDate = value
  }
  get person(): Person {
    return this._person
  }
  set person(value: Person) {
    this._person = value
  }
  get id(): number | undefined {
    return this._id
  }
}
