import { removeEmpty } from "../../utils/functions"
import { IDoctor } from "../IDoctor"

export const getDoctorRequest = (doctor: IDoctor) => {
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
      doctor.nullFlavors && doctor.nullFlavors?.length > 0 ? doctor.nullFlavors.map((item) => item) : undefined,
  }
  _doctor = removeEmpty(_doctor)
  return _doctor
}
export const DOCTOR_RENDER_OPTIONS = {
  render_options: { only: ["id", "guid"], include: ["position", "person", "organization"] },
  includes: ["position", "person", "organization"],
  organization: { only: ["id", "name"] },
  position: { only: ["id", "name"] },
  person: { only: ["id", "SNILS"], include: ["person_name", "address", "contacts"] },
}
