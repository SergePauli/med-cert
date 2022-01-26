import { makeAutoObservable } from "mobx"
import { INullFlavorR } from "../INullFlavor"
import { IDeathReason } from "../responses/IDeathReason"
import { IDiagnosis } from "../responses/IDiagnosis"
import { Procedure } from "./Procedure"
import { ISerializable } from "../common/ISerializabale"
import { v4 as uuidv4 } from "uuid"
import { NULL_FLAVOR_IDX } from "../../utils/defaults"
import { IDeathReasonR } from "../requests/IDeathReasonR"
import { IProcedureR } from "../requests/IProcedureR"
export class DeathReason implements ISerializable {
  private _oldOne: IDeathReason
  private _id?: number
  private _diagnosis?: IDiagnosis | undefined
  private _effectiveTime?: Date | undefined
  private _years?: number | undefined
  private _months?: number | undefined
  private _weeks?: number | undefined
  private _days?: number | undefined
  private _hours?: number | undefined
  private _minutes?: number | undefined
  private _guid: string
  private _procedures: Procedure[]
  private _nullFlavors: INullFlavorR[]

  constructor(props: IDeathReason) {
    this._oldOne = { ...props }
    this._id = props.id
    this._guid = props.guid || uuidv4()
    this._diagnosis = props.diagnosis || props.ext_diagnosis
    if (props.effective_time) this._effectiveTime = new Date(props.effective_time)
    this._procedures = props.procedures?.map((proc) => new Procedure(proc)) || []
    this._nullFlavors =
      props.null_flavors?.map((item) => {
        return { ...item, code: NULL_FLAVOR_IDX[item.code] } as INullFlavorR
      }) || []
    makeAutoObservable(this, undefined, { deep: false })
  }
  get id(): number | undefined {
    return this._id
  }

  set id(id: number | undefined) {
    this._id = id
  }

  get diagnosis(): IDiagnosis | undefined {
    return this._diagnosis
  }
  set diagnosis(value: IDiagnosis | undefined) {
    this._diagnosis = value
  }
  get effectiveTime(): Date | undefined {
    return this._effectiveTime
  }
  set effectiveTime(value: Date | undefined) {
    this._effectiveTime = value
  }
  get years(): number | undefined {
    return this._years
  }
  set years(value: number | undefined) {
    this._years = value
  }
  get months(): number | undefined {
    return this._months
  }
  set months(value: number | undefined) {
    this._months = value
  }
  get weeks(): number | undefined {
    return this._weeks
  }
  set weeks(value: number | undefined) {
    this._weeks = value
  }
  get days(): number | undefined {
    return this._days
  }
  set days(value: number | undefined) {
    this._days = value
  }
  get hours(): number | undefined {
    return this._hours
  }
  set hours(value: number | undefined) {
    this._hours = value
  }
  get minutes(): number | undefined {
    return this._minutes
  }
  set minutes(value: number | undefined) {
    this._minutes = value
  }
  get procedures(): Procedure[] {
    return this._procedures
  }
  set procedures(value: Procedure[]) {
    this._procedures = value
  }
  get nullFlavors(): INullFlavorR[] {
    return this._nullFlavors
  }
  set nullFlavors(value: INullFlavorR[]) {
    this._nullFlavors = value
  }

  // получение копии массива заполнителей из Observable.array
  null_flavors_attributes() {
    return this._nullFlavors.map((el) => {
      return { ...el }
    })
  }
  procNames(): string {
    let _result = ""
    this._procedures.forEach((proc) => {
      _result += proc.textValue || proc.medicalServ.name
      if (proc.effectiveTime) _result += " от " + proc.timeStr()
      _result += "; "
    })
    return _result
  }
  getAttributes(isExt = false): IDeathReasonR {
    let _dr = { guid: this._guid } as IDeathReasonR
    if (this._id && this._id > -1) _dr.id = this._id
    if (this._effectiveTime) _dr.effective_time = this._effectiveTime
    if (this._diagnosis && !isExt) _dr.diagnosis_id = Number.parseInt(this._diagnosis.id)
    if (this._diagnosis && isExt) _dr.ext_diagnosis_id = Number.parseInt(this._diagnosis.id)
    if (this._nullFlavors.length > 0) _dr.null_flavors_attributes = this.null_flavors_attributes()
    if (this._procedures.length > 0) _dr.procedures_attributes = this._procedures.map((item) => item.getAttributes())
    if (this._oldOne.procedures && this._oldOne.procedures.length > 0) {
      let _temp = [] as IProcedureR[]
      this._oldOne.procedures.forEach((item) => {
        if (!_dr.procedures_attributes || _dr.procedures_attributes.findIndex((pr) => pr.id === item.id) === -1)
          _temp.push({ id: item.id, _destroy: "1" } as IProcedureR)
      })
      if (_dr.procedures_attributes && _temp.length > 0)
        _dr.procedures_attributes = _dr.procedures_attributes.concat(_temp)
      else if (_temp.length > 0) _dr.procedures_attributes = _temp
    }
    return _dr
  }
}
