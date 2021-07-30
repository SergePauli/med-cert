export interface IRegisterForm {
  email: string
  name: string
  password: string
  password_confirmation: string
  organization: { id: string; name: string }
  phone_number: string
}
