import { removeEmpty } from "../../utils/functions"
import { IAudit } from "../IAudit"
import { IDoctor } from "../IDoctor"

//генерит API запрос на добавление врача
export const genCreateDoctorRequest = (doctor: IDoctor) => {
  let _doctor = {
    id: doctor.id,
    guid: doctor.guid,
    position_id: doctor.position?.id,
    organization_id: doctor.organization?.id,
    person_attributes: {
      id: doctor.person?.id,
      person_name_attributes: { ...doctor.person?.person_name },
      SNILS: doctor.person?.SNILS,
      address_attributes: doctor.person?.address ? { ...doctor.person?.address } : undefined,
      contacts_attributes:
        doctor.person?.contacts && doctor.person?.contacts?.length > 0
          ? doctor.person?.contacts.map((item) => item)
          : undefined,
    },
    null_flavor_attributes:
      doctor.null_flavors && doctor.null_flavors?.length > 0 ? doctor.null_flavors.map((item) => item) : undefined,
  }
  _doctor = removeEmpty(_doctor)
  return _doctor
}

//Стандартные настройки JSON рендеринга модели врача
export const DOCTOR_RENDER_OPTIONS = {
  render_options: { only: ["id", "guid"], include: ["position", "person", "organization"] },
  includes: ["position", "person", "organization"],
  organization: { only: ["id", "name"] },
  position: { only: ["id", "name"] },
  person: { only: ["id", "SNILS"], include: ["person_name", "address", "contacts"] },
}

//генерит API запрос на обновление врача
export const genUpdateDoctorRequest = (oldValue: IDoctor, newValue: IDoctor) => {
  if (oldValue.id !== newValue.id) return false
  let _request = { Doctor: {}, audits: [] as IAudit[] } as any
  const createAudit = (audit: IAudit) => {
    let _audits = _request.audits.filter((item: IAudit) => item.field !== audit.field)
    if (_audits) {
      _audits.push(audit)
      _request.audits = _audits
    } else _request.audits.push(audit) // keep only uniq changes
  }
  if (oldValue.position?.id !== newValue.position?.id) {
    _request.Doctor.position_id = newValue.position?.id
    createAudit({
      field: "position",
      before: oldValue.position?.id + "",
      after: newValue.position?.id + "",
      detail: `должность: ${oldValue.position?.name} -> ${newValue.position?.name}`,
    } as IAudit)
  }
  let _person_attributes = {} as any
  const oldPerson = oldValue.person
  const newPerson = newValue.person
  if (oldPerson?.SNILS !== newPerson?.SNILS) {
    _person_attributes.SNILS = newPerson?.SNILS
    createAudit({
      field: "person.SNILS",
      before: oldPerson?.SNILS,
      after: newPerson?.SNILS,
      detail: `СНИЛС: ${oldPerson?.SNILS} -> ${newPerson?.SNILS}`,
    } as IAudit)
  }
  let _person_name_attributes = {} as any
  const oldFIO = oldPerson?.person_name
  const newFIO = newValue.person?.person_name
  if (!!oldFIO && !!newFIO) {
    if (oldFIO.family !== newFIO.family) {
      _person_name_attributes.family = newFIO.family
      createAudit({
        field: "person.person_name.family",
        before: oldFIO.family,
        after: newFIO.family,
        detail: `фамилия: ${oldFIO.family} -> ${newFIO.family}`,
      } as IAudit)
    }
    if (oldFIO.given_1 !== newFIO.given_1) {
      _person_name_attributes.given_1 = newFIO.given_1
      createAudit({
        field: "person.person_name.given_1",
        before: oldFIO.given_1,
        after: newFIO.given_1,
        detail: `имя: ${oldFIO.given_1} -> ${newFIO.given_1}`,
      } as IAudit)
    }
    if (oldFIO.given_2 !== newFIO.given_2) {
      _person_name_attributes.given_2 = newFIO.given_2
      createAudit({
        field: "person.person_name.given_2",
        before: oldFIO.given_2,
        after: newFIO.given_2,
        detail: `Отчество: ${oldFIO.given_2} -> ${newFIO.given_2}`,
      } as IAudit)
    }
  }
  if (Object.keys(_person_name_attributes).length > 0)
    if (newValue.person.person_name)
      _person_attributes.person_name_attributes = { id: newValue.person.person_name.id, ..._person_name_attributes }
  const oldAddress = oldPerson.address?.streetAddressLine
  const newAddress = newPerson.address?.streetAddressLine
  if (oldAddress !== newAddress) {
    _person_attributes.address_attributes = newPerson.address
    createAudit({
      field: "person.address",
      before: oldAddress,
      after: newAddress,
      detail: `адрес: ${oldAddress} -> ${newAddress}`,
    } as IAudit)
  }
  const oldContacts = oldPerson.contacts?.reduce<string>((u, item) => `${u} ${item.telcom_value}`, "").trim()
  const newContacts = newPerson.contacts?.reduce<string>((u, item) => `${u} ${item.telcom_value}`, "").trim()
  if (oldContacts !== newContacts) {
    _person_attributes.contacts_attributes = newPerson.contacts
    createAudit({
      field: "person.contacts",
      before: oldContacts,
      after: newContacts,
      detail: `контакты: ${oldContacts} -> ${newContacts}`,
    } as IAudit)
  }
  const oldNullFlavors = oldPerson.null_flavors
    ?.reduce<string>((u, item) => `${u} ${item.parent_attr}${item.code}`, "")
    .trim()
  const newNullFlavors = newPerson.null_flavors
    ?.reduce<string>((u, item) => `${u} ${item.parent_attr}${item.code}`, "")
    .trim()
  if (oldNullFlavors !== newNullFlavors) {
    _person_attributes.contacts = newPerson.null_flavors
    createAudit({
      field: "person.nullFlavors",
      before: oldNullFlavors,
      after: newNullFlavors,
      detail: `изменены причины отсутствия информации`,
    } as IAudit)
  }

  if (Object.keys(_person_attributes).length > 0)
    _request.Doctor.person_attributes = { id: oldPerson.id, ..._person_attributes }
  if (Object.keys(_request.Doctor).length > 0) {
    _request.Doctor.id = newValue.id
    return _request
  } else return false
}
