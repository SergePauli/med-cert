import { observer } from 'mobx-react-lite'
import { useContext} from 'react'
import { useState } from 'react'
import { FC } from 'react'
import { Link, useHistory} from 'react-router-dom'
import { Context } from '..'
import logo from "../images/security.png"
import '../styles/login.css'
import { InputText } from 'primereact/inputtext'
import {Password} from 'primereact/password'
import { Button } from 'primereact/button'
import { Field, Form } from 'react-final-form'
import { classNames } from 'primereact/utils'
import LoginImageDiv from '../static/LoginImageDiv'

interface IAuth {
  email: string
  password: string
}
const LoginPage: FC = () => { 
  const [ formData, setFormData] = useState<IAuth>({} as IAuth);  
  const {userStore} = useContext(Context)
  const history = useHistory()

  const validate = (data: IAuth) => {
     let errors: any = {}        
        if (!data.email) {
            errors.email = 'Поле <Email> обязательно'
        }
        if (!data.password) {
            errors.password = 'Поле <Пароль> обязательно'
        }
        return errors
    }
  const onSubmit = (data: IAuth, form: any) => {
    try {
        userStore.login(data.email, data.password)
    } catch {
      setFormData(data)
      form.restart()
    }          
  }
  const onPassordRecovery =() => {
    try {
      history.push("/message/Вам в почту направлено письмо, со ссылкой на страницу изменения пароля" )
    } catch (e) {
      console.log(e)
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
          <img src={logo} className='logo' alt="logo"></img>
          <div className="login-form">
            <h2>Авторизация</h2>
            <p>Нет учетной записи? <Link to="/registration">Регистрация</Link></p>
            <Form onSubmit={onSubmit} initialValues={{email: '', password: '' }} 
              validate={validate} 
              render={({ handleSubmit }) => (
              <form onSubmit={handleSubmit} className="p-fluid">
                <Field name="email" render={({ input, meta }) => (
                    <div className="p-field">
                      <span className="p-float-label p-input-icon-right">
                        <i className="pi pi-envelope" />
                        <InputText id="email" autoFocus {...input} className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />
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
              <Button type="submit" label="ВОЙТИ" style={{marginBottom:"1rem"}}/>   
              <Button onClick={onPassordRecovery} label="не помню пароль" className="p-button-link"  /> 
            </form>)}/>            
          </div>
        </div>  
        <LoginImageDiv/>      
      </div>
    </div>
  </>
)}
export default observer(LoginPage)