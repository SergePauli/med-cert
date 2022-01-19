import { makeAutoObservable } from "mobx"
import { v4 as uuidv4 } from "uuid"
import { NULL_FLAVOR_IDX } from "../../utils/defaults"
import { ISerializable } from "../common/ISerializabale"
import { IChildInfo } from "../IChildInfo"
import { INullFlavorR } from "../INullFlavor"
import { IChildInfoR } from "../requests/IChildInfoR"
import RelatedSubject from "./RelatedSubject"

export class ChildInfo implements ISerializable {
  private _id?: number
  private _guid: string
  private _termPregnancy?: number | undefined
  private _weight?: number | undefined
  private _whichAccount?: number | undefined
  private _relatedSubject?: RelatedSubject | undefined
  private _nullFlavors: INullFlavorR[]

  constructor(props: IChildInfo | undefined = undefined) {
    if (props) {
      this._id = props.id
      this._guid = props.guid || uuidv4()
      this._termPregnancy = props.term_pregnancy
      this._weight = props.weight
      this._whichAccount = props.which_account
      if (props.null_flavors && props.null_flavors.length > 0)
        this._nullFlavors = props.null_flavors.map((item) => {
          return { ...item, code: NULL_FLAVOR_IDX[item.code] } as INullFlavorR
        })
      else this._nullFlavors = []
      if (props.related_subject) this._relatedSubject = new RelatedSubject(props.related_subject)
    } else {
      this._nullFlavors = []
      this._guid = uuidv4()
    }
    makeAutoObservable(this, undefined, { deep: false })
  }

  get termPregnancy(): number | undefined {
    return this._termPregnancy
  }
  set termPregnancy(value: number | undefined) {
    this._termPregnancy = value
  }
  get weight(): number | undefined {
    return this._weight
  }
  set weight(value: number | undefined) {
    this._weight = value
  }
  get whichAccount(): number | undefined {
    return this._whichAccount
  }
  set whichAccount(value: number | undefined) {
    this._whichAccount = value
  }
  get relatedSubject(): RelatedSubject | undefined {
    return this._relatedSubject
  }
  set relatedSubject(value: RelatedSubject | undefined) {
    this._relatedSubject = value
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

  getAttributes(): IChildInfoR {
    let _chInfo = { guid: this._guid } as IChildInfoR
    if (this._nullFlavors.length > 0) _chInfo.null_flavors_attributes = this.null_flavors_attributes()
    if (this._relatedSubject) _chInfo.related_subject_attributes = this._relatedSubject.getAttributes()
    if (this._termPregnancy) _chInfo.term_pregnancy = this._termPregnancy
    if (this._weight) _chInfo.weight = this._weight
    if (this._whichAccount) _chInfo.which_account = this._whichAccount
    if (this._id) _chInfo.id = this._id
    return _chInfo
  }
}
