import { makeAutoObservable } from "mobx"
import { ISerializable } from "../common/ISerializabale"
import { IAuthenticatorR } from "../requests/IAuthenticatorR"
import { IAuthenticator } from "../responses/IAuthenticator"

export default class Authenticator implements ISerializable {
  private _id?: number | undefined
  private _time?: Date | undefined
  private _doctorID?: number | undefined
  constructor(props: IAuthenticator) {
    this._id = props.id
    this._doctorID = props.doctor.id
    if (props.time) this._time = new Date(props.time)
    else this._time = new Date()
    makeAutoObservable(this)
  }
  get time(): Date | undefined {
    return this._time
  }
  set time(value: Date | undefined) {
    this._time = value
  }
  get doctorID(): number | undefined {
    return this._doctorID
  }
  set doctorID(value: number | undefined) {
    this._doctorID = value
  }
  get id(): number | undefined {
    return this._id
  }

  getAttributes(): IAuthenticatorR {
    let _authenticator = { time: this._time } as IAuthenticatorR
    if (this._id) _authenticator.id = this._id
    if (this._doctorID) _authenticator.doctor_id = this._doctorID
    return _authenticator
  }
}
