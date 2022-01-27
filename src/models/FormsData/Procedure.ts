import { makeAutoObservable } from "mobx"
import { v4 as uuidv4 } from "uuid"
import { DATE_FORMAT, TIME_FORMAT } from "../../utils/consts"
import { NULL_FLAVOR_IDX } from "../../utils/defaults"
import { ISerializable } from "../common/ISerializabale"
import { INullFlavorR } from "../INullFlavor"
import { IProcedureR } from "../requests/IProcedureR"
import { IMedicalServs } from "../responses/IMedservs"
import { IProcedure } from "../responses/IProcedure"

export class Procedure implements ISerializable {
  private _id?: number
  private _medicalServ: IMedicalServs
  private _guid: string
  private _textValue?: string | undefined
  private _effectiveTime?: Date
  private _nullFlavors: INullFlavorR[]
  constructor(props: IProcedure) {
    this._id = props.id
    this._guid = props.guid || uuidv4()
    this._medicalServ = props.medical_serv
    this._textValue = props.text_value
    if (props.effective_time) this._effectiveTime = new Date(props.effective_time)
    this._nullFlavors =
      props.null_flavors?.map((item) => {
        return { ...item, code: NULL_FLAVOR_IDX[item.code] } as INullFlavorR
      }) || []
    makeAutoObservable(this, undefined, { deep: false })
  }
  getAttributes(): IProcedureR {
    let _pr = { guid: this._guid } as IProcedureR
    if (this._id && this._id > -1) _pr.id = this._id
    if (this._effectiveTime) _pr.effective_time = this._effectiveTime.toLocaleString()
    if (this._medicalServ) _pr.medical_serv_id = this._medicalServ.id
    if (this._textValue) _pr.text_value = this._textValue
    if (this._nullFlavors.length > 0) _pr.null_flavors_attributes = this.null_flavors_attributes()
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
  get textValue(): string | undefined {
    return this._textValue
  }
  set textValue(value: string | undefined) {
    this._textValue = value
  }
  get medicalServ(): IMedicalServs {
    return this._medicalServ
  }
  set medicalServ(value: IMedicalServs) {
    this._medicalServ = value
  }
  // получение копии массива заполнителей из Observable.array
  null_flavors_attributes() {
    return this._nullFlavors.map((el) => {
      return { ...el }
    })
  }

  get guid(): string {
    return this._guid
  }

  timeStr(): string {
    if (this._effectiveTime === undefined) return ""
    return this._effectiveTime?.toLocaleString(
      "ru",
      this._effectiveTime.getHours() === 0 && this._effectiveTime.getMinutes() === 0 ? DATE_FORMAT : TIME_FORMAT
    )
  }
}
