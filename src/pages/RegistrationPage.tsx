import { useHistory} from 'react-router-dom'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Password } from 'primereact/password'
import { Dropdown } from 'primereact/dropdown'
import { InputMask } from 'primereact/inputmask'
import { classNames } from 'primereact/utils'
import  '../styles/components/Dropdown.css'
import  '../styles/components/Inputtext.css'
import React, { useContext, useState } from 'react'
import { FC } from 'react'
import { Field, Form } from 'react-final-form'
import { Context } from '..'
import logo from "../images/security.png"
import { IRegisterForm } from '../models/FormsData/IRegisterForm'
import { IRegistration } from '../models/requests/IRegistration'
import LoginImageDiv from '../static/LoginImageDiv'
import OrganizationService from '../services/OrganizationService'
import { useEffect } from 'react'
import { IReferenceId } from '../models/IReference'

export const RegistrationPage: FC = () =>{ 
  const history = useHistory()  
  const [organizations, setOrganizations] = useState<IReferenceId[] | null>(null)
  useEffect(()=>{
    if (organizations===null) OrganizationService.getOrganizations().then(response=>
      setOrganizations(response.data.organizations)
    ).catch(()=>{
      setOrganizations([])
      history.push("/error/Ошибка API при получении списка МО")
    })},[organizations, history])
  const {userStore} = useContext(Context)  
  const validate = (data: IRegisterForm) => {
    let errors: any = {} 
    if (!data.name || (data.name.trim().split(' ').length < 2)){             
            errors.name = 'значение <ФИО> некорректно'
    }       
    if (!data.email) {
       errors.email = 'Поле <Email> обязательно'
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(data.email)) {
       errors.email = 'Неверный email Н.п. example@email.com'
    }
    if (!data.password) {
       errors.password = 'Поле <Пароль> обязательно'
    } else if (data.password && data.password!==data.password_confirmation) {
       errors.password_confirmation = 'пароли не совпадают'
    }     
    if (data.organization == null ) {
       errors.organization = 'Поле <Медорганизация> обязательно'       
    }   
    return errors
  }
    const onSubmit = async (data: IRegisterForm, form: any) => {
    const request:IRegistration  = {} as IRegistration 
    try {
        const names = data.name.trim().split(' ')
        request.person_name_attributes = {family: names[0], given_1: names[1]}         
        if (names.length>2)  request.person_name_attributes.given_2= names[2]  
        if (data.phone_number) request.contacts_attributes={telcom_value: data.phone_number, main: true}        
        request.email = data.email
        request.password = data.password
        request.password_confirmation = data.password_confirmation
        request.organization_id = data.organization.id                  
        userStore.registration(request)        
    } catch (e:any){
      history.push("/error/"+e.message)      
    }          
  }
  const isFormFieldValid = (meta: any) => !!(meta.touched && meta.error)
  const getFormErrorMessage = (meta: any) => {
    return (isFormFieldValid(meta) && <small className="p-error">{meta.error}</small>)
  } 
  if (organizations)
  return (
  <>
    <div className="login-body">
      <div className="login-wrapper">
        <div className="login-panel">
          <img src={logo} className="logo_reg" alt="logo"></img>
          <div className="login-form">
            <h2>Регистрация</h2>            
            <Form onSubmit={onSubmit} initialValues={{name: '', email: '', password: '', password_confirmation: '', organization: null, phone_number: ''}} 
              validate={validate} 
              render={({ handleSubmit }) => (
              <form onSubmit={handleSubmit} className="p-fluid" >
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
                        <Password id="password_confirmation" {...input}  toggleMask className={classNames({ 'p-invalid': isFormFieldValid(meta) })}  />
                        <label htmlFor="password_confirmation" className={classNames({ 'p-error': isFormFieldValid(meta) })}>Еще раз пароль*</label>
                      </span>
                      {getFormErrorMessage(meta)}
                    </div>
                  )} />
                  <Field name="organization" render={({ input, meta }) => (
                    <div className="p-field">
                      <span className="p-float-label">
                       <Dropdown id="organization" {...input} options={organizations}
                        filter showClear optionLabel="name" className="p-inputwrapper p-inputwrapper-filled"/>  
                        <label htmlFor="organization" className={classNames({ 'p-error': isFormFieldValid(meta) })}>Медорганизация*</label>                     
                      </span>  
                      {getFormErrorMessage(meta)}                    
                    </div>
                  )} />
                  <Field name="phone" render={({ input, meta }) => (
                    <div className="p-field">
                      <span className="p-float-label p-input-icon-right">
                        <i className="pi pi-phone" />
                       <InputMask id="phone" {...input} mask="+7(999) 999-9999"  className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />
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
  else return <></>
}