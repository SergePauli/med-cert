import { makeAutoObservable } from "mobx"
import { DATE_FORMAT, TIME_FORMAT } from "../../utils/consts"
import { ISerializable } from "../common/ISerializabale"
import { IMedicalServs } from "../responses/IMedservs"
import { IProcedure } from "../responses/IProcedure"

export class Procedure implements ISerializable {
  private _id?: number
  private _medicalServ: IMedicalServs
  private _textValue?: String | undefined
  private _effectiveTime?: Date
  constructor(props: IProcedure) {
    this._id = props.id
    this._medicalServ = props.medical_serv
    this._textValue = props.text_value
    this._effectiveTime = props.effective_time
    makeAutoObservable(this)
  }
  getAttributes(): IProcedure {
    let _pr = {} as IProcedure
    if (this._id) _pr.id = this._id
    if (this._effectiveTime) _pr.effective_time = this._effectiveTime
    if (this._medicalServ) {
      _pr.medical_serv = { ...this._medicalServ }
      _pr.medical_serv_id = this._medicalServ.id
    }
    if (this._textValue) _pr.text_value = this._textValue

    return _pr
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

  timeStr(): string {
    if (this._effectiveTime === undefined) return ""
    return this._effectiveTime?.toLocaleString(
      "ru",
      this._effectiveTime.getHours() === 0 && this._effectiveTime.getMinutes() === 0 ? DATE_FORMAT : TIME_FORMAT
    )
  }
}
