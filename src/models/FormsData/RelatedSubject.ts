import { makeAutoObservable } from "mobx"
import { v4 as uuidv4 } from "uuid"
import { INullFlavor } from "../INullFlavor"
import { IPersonName } from "../IPersonName"
import { IRelatedSubject } from "../IRelatedSubject"
import { IAddress } from "../responses/IAddress"

const MATHER = 1

export default class RelatedSubject {
  private _id: string
  private _familyConnection: number
  private _addr?: IAddress | undefined
  private _fio?: IPersonName | undefined
  private _birthTime?: Date | undefined
  private _nullFlavors: INullFlavor[]

  constructor(props: IRelatedSubject) {
    this._nullFlavors = props.null_flavors || []
    this._id = props.id || uuidv4()
    this._familyConnection = props.family_connection || MATHER
    this._fio = props.person_name
    this._birthTime = props.birthTime
    this._addr = props.addr
    makeAutoObservable(this)
  }
  get id(): string {
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
}
