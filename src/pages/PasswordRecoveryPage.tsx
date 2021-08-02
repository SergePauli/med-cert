import { FC, useContext } from 'react'
import { Field, Form } from 'react-final-form'
import { Button } from 'primereact/button'
import { Password } from 'primereact/password'
import { classNames } from 'primereact/utils'
import { Context } from '..'
import { IRouteMatch } from '../models/IRouteMatch'
import { IRouteProps } from '../models/IRouteProps'
import LoginImageDiv from '../static/LoginImageDiv'
import logo from '../images/security.png'
import { IPassRenew } from '../models/requests/IPassRenew'
interface IParams {code: string}
interface IMatch extends IRouteMatch {  
  params: IParams
}
interface PasswordRecoveryPageProps extends IRouteProps {  
  match: IMatch  
}
export const PassordRecoveryPage: FC<PasswordRecoveryPageProps> = (props: PasswordRecoveryPageProps) =>{
  const {userStore} = useContext(Context)
  const validate = (data: IPassRenew) => {
    let errors: any = {}        
    if (!data.password) {
       errors.password = 'Поле <Пароль> обязательно'
    } else if (data.password && data.password!=data.password_confirmation) {
       errors.password_confirmation = 'пароли не совпадают'
    }      
    return errors
  }
  const isFormFieldValid = (meta: any) => !!(meta.touched && meta.error)
  const getFormErrorMessage = (meta: any) => {
    return (isFormFieldValid(meta) && <small className="p-error">{meta.error}</small>)
  }
  const onSubmit = (data: IPassRenew, form: any) => {          
     userStore.pwd_renew(data)       
  }   
  return (
  <>    
    <div className="login-body">
      <div className="login-wrapper">
        <div className="login-panel">
          <img src={logo} className='logo' alt="logo"></img>
          <div  className="login-form" >
            <h2>Восстановить пароль</h2>            
            <Form onSubmit={onSubmit} initialValues={{ activation_link: props.match.params.code,password: '', password_confirmation: '' }} 
              validate={validate} 
              render={({ handleSubmit }) => (
              <form  onSubmit={handleSubmit}  className="p-fluid">                
                  <Field name="password"  render={({ input, meta }) => (
                    <div className="p-field">
                      <span className="p-float-label p-input-icon-right">
                        <Password id="password" autoComplete='off' {...input} toggleMask className={classNames({ 'p-invalid': isFormFieldValid(meta) })}  />
                        <label htmlFor="password" className={classNames({ 'p-error': isFormFieldValid(meta) })}>Новый пароль*</label>
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
              <Button type="submit" label="ИЗМЕНИТЬ" />               
            </form>)}/>            
          </div>
        </div>  
        <LoginImageDiv/>      
      </div>
    </div>
  </>)
}