import { makeAutoObservable } from "mobx"
import { v4 as uuidv4 } from "uuid"
import { NULL_FLAVOR_IDX } from "../../utils/defaults"
import { ISerializable } from "../common/ISerializabale"
import { INullFlavorR } from "../INullFlavor"
import { IPersonName } from "../IPersonName"
import { IRelatedSubject } from "../IRelatedSubject"
import { IAddressR } from "../requests/IAddressR"
import { IRelatedSubjectR } from "../requests/IRelatedSubjectR"

const MATHER = 1

export default class RelatedSubject implements ISerializable {
  private _id?: number
  private _guid: string
  private _familyConnection: number
  private _addr?: IAddressR | undefined
  private _fio?: IPersonName | undefined
  private _birthTime?: Date | undefined
  private _nullFlavors: INullFlavorR[]

  constructor(props: IRelatedSubject) {
    this._guid = props.guid || uuidv4()
    this._nullFlavors =
      props.null_flavors?.map((item) => {
        return { ...item, code: NULL_FLAVOR_IDX[item.code] } as INullFlavorR
      }) || []
    this._id = props.id
    this._familyConnection = props.family_connection || MATHER
    this._fio = props.person_name
    if (props.birthTime) this._birthTime = new Date(props.birthTime)
    this._addr = {
      ...props.addr,
      null_flavors_attributes:
        props.addr?.null_flavors?.map((item) => {
          return { ...item, code: NULL_FLAVOR_IDX[item.code] } as INullFlavorR
        }) || [],
    } as IAddressR
    makeAutoObservable(this, undefined, { deep: false })
  }

  get addr(): IAddressR | undefined {
    return this._addr
  }
  set addr(value: IAddressR | undefined) {
    this._addr = value
  }
  get fio(): IPersonName | undefined {
    return this._fio
  }
  set fio(value: IPersonName | undefined) {
    this._fio = value
  }

  get birthTime(): Date | undefined {
    return this._birthTime
  }
  set birthTime(value: Date | undefined) {
    this._birthTime = value
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

  getAttributes(): IRelatedSubjectR {
    let _rs = { family_connection: this._familyConnection, guid: this._guid } as IRelatedSubjectR
    if (this._nullFlavors.length > 0) _rs.null_flavors_attributes = this.null_flavors_attributes()
    if (this._addr) _rs.addr_attributes = { ...this._addr }
    if (this._birthTime) _rs.birthTime = this._birthTime.toLocaleDateString()
    else _rs.birthTime = null
    if (this._fio) _rs.person_name_attributes = { ...this._fio }
    if (this._id) _rs.id = this._id
    return _rs
  }
}
