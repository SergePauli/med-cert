import { makeAutoObservable } from "mobx"
import { IAuthenticator } from "../IAuthenticator"

export default class Authenticator {
  private _id: string | undefined
  private _time?: Date | undefined
  private _doctor?: { id: number; name: string } | undefined
  constructor(props: IAuthenticator) {
    this._id = props.id
    if (props.doctor)
      this._doctor = {
        id: props.doctor.id,
        name: props.doctor.name,
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
  get doctor(): { id: number; name: string } | undefined {
    return this._doctor
  }
  set doctor(value: { id: number; name: string } | undefined) {
    this._doctor = value
  }
  get id(): string | undefined {
    return this._id
  }
}
