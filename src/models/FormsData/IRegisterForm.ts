export interface IRegisterForm {
  email: string
  name: string
  password: string
  password_confirmation: string
  organization: { id: number; name: string }
  phone_number: string
}
