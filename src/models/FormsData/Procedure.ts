import { makeAutoObservable } from "mobx"
import { IMedicalServs } from "../responses/IMedservs"
import { IProcedure } from "../responses/IProcedure"

export class Procedure {
  private _id?: number
  private _deathReasonID: string
  private _medicalServ: IMedicalServs
  private _textValue?: String | undefined
  private _effectiveTime?: Date
  constructor(props: IProcedure) {
    this._id = props.id
    this._deathReasonID = props.external_reason
    this._medicalServ = props.medical_serv
    this._textValue = props.text_value
    this._effectiveTime = props.effective_time
    makeAutoObservable(this)
  }
  get id(): number | undefined {
    return this._id
  }
  set id(value: number | undefined) {
    this._id = value
  }
  get effectiveTime(): Date | undefined {
    return this._effectiveTime
  }
  set effectiveTime(value: Date | undefined) {
    this._effectiveTime = value
  }
  get textValue(): String | undefined {
    return this._textValue
  }
  set textValue(value: String | undefined) {
    this._textValue = value
  }
  get medicalServ(): IMedicalServs {
    return this._medicalServ
  }
  set medicalServ(value: IMedicalServs) {
    this._medicalServ = value
  }
  get deathReasonID(): string {
    return this._deathReasonID
  }
}
