import { makeAutoObservable } from "mobx"
import { ISerializable } from "../common/ISerializabale"
import { INullFlavor } from "../INullFlavor"
import { IPersonName } from "../IPersonName"
import { IRelatedSubject } from "../IRelatedSubject"
import { IAddress } from "../responses/IAddress"

const MATHER = 1

export default class RelatedSubject implements ISerializable {
  private _id?: string
  private _familyConnection: number
  private _addr?: IAddress | undefined
  private _fio?: IPersonName | undefined
  private _birthTime?: Date | undefined
  private _nullFlavors: INullFlavor[]

  constructor(props: IRelatedSubject) {
    this._nullFlavors = props.null_flavors || props.null_flavors_attributes || []
    this._id = props.id
    this._familyConnection = props.family_connection || MATHER
    this._fio = props.person_name
    this._birthTime = props.birthTime
    this._addr = props.addr
    makeAutoObservable(this, undefined, { deep: false })
  }
  get id(): string | undefined {
    return this._id
  }
  get addr(): IAddress | undefined {
    return this._addr
  }
  set addr(value: IAddress | undefined) {
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
  get nullFlavors(): INullFlavor[] {
    return this._nullFlavors
  }
  set nullFlavors(value: INullFlavor[]) {
    this._nullFlavors = value
  }

  // получение копии массива заполнителей из Observable.array
  null_flavors_attributes() {
    return this._nullFlavors.map((el) => {
      return { ...el }
    })
  }

  getAttributes(): IRelatedSubject {
    let _rs = { family_connection: this._familyConnection } as IRelatedSubject
    if (this._nullFlavors.length > 0) _rs.null_flavors_attributes = this.null_flavors_attributes()
    if (this._addr) _rs.addr_attributes = this._addr
    if (this._birthTime) _rs.birthTime = this._birthTime
    if (this._fio) _rs.person_name_attributes = { ...this._fio }
    return _rs
  }
}
