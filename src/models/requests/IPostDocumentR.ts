export interface ICodeRecord {
  code: string
  codeSystem: string | null
  codeSystemName: string | null
  codeSystemVersion: string | null
  displayName: string | null
}

export interface ISignature {
  data: string
  checksum: number
}

export interface IPersonInfo {
  surname: string
  name: string
  patrName: string
  birthDate: string
  gender?: ICodeRecord
  localId: string
  snils: string
}

export interface ISigner extends IPersonInfo {
  role: {
    code: "AUTHOR"
    codeSystem: "1.2.643.5.1.13.13.99.2.368"
    codeSystemName: "Роли сотрудников при подписании медицинских документов, в том числе в электронном виде"
    codeSystemVersion: "2.4"
    displayName: "Автор документа"
  }
  position: ICodeRecord
  speciality?: ICodeRecord
  email?: string
  phone?: string
  office?: ICodeRecord
}

export interface IPersonalSignature {
  signer: ISigner
  signature: ISignature
  description: string
}

export interface IPostDocumentR {
  localUid: string
  messageId: string
  kind: {
    code: "13"
    codeSystem: "1.2.643.5.1.13.13.99.2.592"
    codeSystemName: "ВИМИС. Типы структурированных медицинских сведений"
    codeSystemVersion: "2.4"
    displayName: "Медицинское свидетельство о смерти"
  }
  vimisDocType: "13"
  vimisDocTypeVersion: "2"
  system: "emdr-medss3.0"
  organization: ICodeRecord
  department: {
    name: string
    localId: ICodeRecord
  }
  documentNumber: string
  creationDateTime: Date
  patient: IPersonInfo
  description: "Медицинское свидетельство о смерти (CDA) Редакция 2"
  docContent: ISignature
  orgSignature: ISignature
  personalSignatures: IPersonalSignature[]
}
