import { makeAutoObservable } from "mobx"
import { v4 as uuidv4 } from "uuid"
import { IAuthenticator } from "../IAuthenticator"

export default class Authenticator {
  private _id: string
  private _time?: Date | undefined
  private _doctor?: { id: string; name: string } | undefined
  constructor(props: IAuthenticator) {
    this._id = props.id || uuidv4()
    if (props.doctor)
      this._doctor = {
        id: props.doctor.id,
        name: `${props.doctor.person_name.family} ${props.doctor.person_name.given_1} ${
          props.doctor.person_name.given_2 || ""
        }`,
      }
    this._time = props.time
    makeAutoObservable(this)
  }
  get time(): Date | undefined {
    return this._time
  }
  set time(value: Date | undefined) {
    this._time = value
  }
  get doctor(): { id: string; name: string } | undefined {
    return this._doctor
  }
  set doctor(value: { id: string; name: string } | undefined) {
    this._doctor = value
  }
  get id(): string {
    return this._id
  }
}
