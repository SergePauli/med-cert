import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Password } from 'primereact/password'
import { Dropdown } from 'primereact/dropdown'
import { InputMask } from 'primereact/inputmask'
import { classNames } from 'primereact/utils'
import React, { useContext, useState } from 'react'
import { FC } from 'react'
import { Field, Form } from 'react-final-form'
import { Context } from '..'
import logo from "../images/security.png"
import { IRegisterForm } from '../models/FormsData/IRegisterFiorm'
import { IRegistration } from '../models/requests/IRegistration'
import LoginImageDiv from '../static/LoginImageDiv'


export const RegistrationPage: FC = () =>{ 
  const [organizations, setOrganizations] = useState([{
    id: "6895109",
    name: "ГАУЗ АО ГП №1"
  },
  {
    id: "6895110",
    name: "ГБУЗ АО \"ГП №2\""
  },
  {
    id: "6895111",
    name: "ГАУЗ АО «ГП №3»"
  },
  {
    id: "6895112",
    name: "ГАУЗ АО ГП №4"
  }]);
  const {userStore} = useContext(Context)
  const [showMessage, setShowMessage] = useState(false);
  const [formData, setFormData] = useState<IRegisterForm>({} as IRegisterForm);
  const validate = (data: IRegisterForm) => {
     let errors: any = {}        
        if (!data.email) {
            errors.email = 'Поле <Email> обязательно'
        }
        if (!data.password) {
            errors.password = 'Поле <Пароль> обязательно'
        }
        return errors
    }
  const onSubmit = (data: IRegisterForm, form: any) => {
    const request:IRegistration  = {} as IRegistration 
    try {
        const names = data.name.split(" ")
        request.person_name_attributes.family= names[0]
        request.person_name_attributes.given_1= names[1]   
        request.contacts_attributes.value = data.phone_number
        request.email = data.email
        request.password = data.password
        request.password_confirmation = data.password_confirmation
        request.organization_id = data.organization_id                
        userStore.registration(request)
    } catch {
      setFormData(data)
      form.restart()
    }          
  }
  const isFormFieldValid = (meta: any) => !!(meta.touched && meta.error)
  const getFormErrorMessage = (meta: any) => {
    return (isFormFieldValid(meta) && <small className="p-error">{meta.error}</small>)
  } 
  return (
  <>
    <div className="login-body">
      <div className="login-wrapper">
        <div className="login-panel">
          <img src={logo} className="logo_reg" alt="logo"></img>
          <div className="login-form">
            <h2>Регистрация</h2>            
            <Form onSubmit={onSubmit} initialValues={{email: '', password: '',organization:null }} 
              validate={validate} 
              render={({ handleSubmit }) => (
              <form onSubmit={handleSubmit} className="p-fluid">
                <Field name="name" render={({ input, meta }) => (
                    <div className="p-field">
                      <span className="p-float-label p-input-icon-right">
                       <InputText id="name" {...input} autoFocus className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />
                        <label htmlFor="name" className={classNames({ 'p-error': isFormFieldValid(meta) })}>Фамилия имя отчество*</label>
                      </span>
                      {getFormErrorMessage(meta)}
                    </div>
                )} />                
                <Field name="email" render={({ input, meta }) => (
                    <div className="p-field">
                      <span className="p-float-label p-input-icon-right">
                        <i className="pi pi-envelope" />
                        <InputText id="email" {...input} className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />
                        <label htmlFor="email" 
                        className={classNames({ 'p-error': isFormFieldValid(meta) })}>Email*</label>
                      </span>
                      {getFormErrorMessage(meta)}
                    </div>
                  )} />
                  <Field name="password" render={({ input, meta }) => (
                    <div className="p-field">
                      <span className="p-float-label p-input-icon-right">
                        <Password id="password" {...input} toggleMask className={classNames({ 'p-invalid': isFormFieldValid(meta) })}  />
                        <label htmlFor="password" className={classNames({ 'p-error': isFormFieldValid(meta) })}>Пароль*</label>
                      </span>
                      {getFormErrorMessage(meta)}
                    </div>
                  )} />
                  <Field name="password_confirmation" render={({ input, meta }) => (
                    <div className="p-field">
                      <span className="p-float-label p-input-icon-right">
                        <Password id="password_confirmation" {...input} toggleMask className={classNames({ 'p-invalid': isFormFieldValid(meta) })}  />
                        <label htmlFor="password_confirmation" className={classNames({ 'p-error': isFormFieldValid(meta) })}>Еще раз пароль*</label>
                      </span>
                      {getFormErrorMessage(meta)}
                    </div>
                  )} />
                  <Field name="organization" render={({ input }) => (
                    <div className="p-field">
                      <span className="p-float-label">
                       <Dropdown id="organization" {...input} options={organizations}  optionLabel="name" />
                       <label htmlFor="organization">Медорганизаия*</label>
                      </span>
                    </div>
                  )} />
                  <Field name="phone" render={({ input, meta }) => (
                    <div className="p-field">
                      <span className="p-float-label p-input-icon-right">
                        <i className="pi pi-phone" />
                       <InputMask id="phone" {...input} mask="(999) 999-9999"  className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />
                        <label htmlFor="phone" className={classNames({ 'p-error': isFormFieldValid(meta) })}>Контактный номер</label>
                      </span>
                      {getFormErrorMessage(meta)}
                    </div>
                )} />
              <Button type="submit" label="ДАЛЕЕ" />    
            </form>)}/>            
          </div>
        </div>  
        <LoginImageDiv/>      
      </div>
    </div>
  </>)
}