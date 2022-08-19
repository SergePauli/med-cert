import { ISerializable } from "./ISerializabale"

export interface ITrackable<T> extends ISerializable {
  get oldOne(): T | undefined
  set oldOne(oldOne: T | undefined)
}
