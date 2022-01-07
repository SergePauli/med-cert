import { makeAutoObservable } from "mobx"
import { ISerializable } from "../common/ISerializabale"
import { IChildInfo } from "../IChildInfo"
import { INullFlavor } from "../INullFlavor"
import RelatedSubject from "./RelatedSubject"

export class ChildInfo implements ISerializable {
  private _termPregnancy?: number | undefined
  private _weight?: number | undefined
  private _whichAccount?: number | undefined
  private _relatedSubject?: RelatedSubject | undefined
  private _nullFlavors: INullFlavor[]

  constructor(props: IChildInfo | undefined = undefined) {
    if (props) {
      this._termPregnancy = props.term_pregnancy
      this._weight = props.weight
      this._whichAccount = props.which_account
      this._nullFlavors = props.null_flavors || props.null_flavors_attributes || []
      if (props.related_subject) this._relatedSubject = new RelatedSubject(props.related_subject)
    } else this._nullFlavors = []
    makeAutoObservable(this)
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
  get nullFlavors(): INullFlavor[] {
    return this._nullFlavors
  }
  set nullFlavors(value: INullFlavor[]) {
    this._nullFlavors = value
  }

  getAttributes(): IChildInfo {
    let _chInfo = {} as IChildInfo
    if (this._nullFlavors.length > 0) _chInfo.null_flavors_attributes = this._nullFlavors
    if (this._relatedSubject) _chInfo.related_subject_attributes = this._relatedSubject.getAttributes()
    if (this._termPregnancy) _chInfo.term_pregnancy = this._termPregnancy
    if (this._weight) _chInfo.weight = this._weight
    if (this._whichAccount) _chInfo.which_account = this._whichAccount
    return _chInfo
  }
}
