import { observer } from 'mobx-react-lite'
import React, { useContext } from 'react'
import { useState } from 'react'
import { FC } from 'react'
import { Link } from 'react-router-dom'
import { Context } from '..'
import '../styles/login.css'


const LoginPage: FC = () => {
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const {userStore} = useContext(Context)
  return (
  <>
    <div className="login-body">
      <div className="login-wrapper">
        <div className="login-panel">
          <img src="" className="logo" alt="diamond-layout"></img>
          <div className="login-form">
            <h2>Вход</h2>
            <p>Нет учетной записи? <Link to="/registration">Подать заявку</Link></p>
              <input onChange={e => setEmail(e.target.value)}
                className="p-inputtext p-component"
                value={email}
                type="text"
                placeholder="email"
              />
              <input onChange={e => setPassword(e.target.value)}
                value={password}
                type="password"
                placeholder="password"
              />
              <button className='p-button p-component' onClick={()=>userStore.login(email,password)}>ВОЙТИ</button>    
            </div>
          </div>
          <div className="login-image">
            <div className="login-image-content">
              <h1>Медиинское</h1>
              <h1>свидетельство</h1>
              <h1>о смерти</h1>
              <h3>версия 3.0</h3>
              <h3>(с учетом требований CDA_R2 уровня 3)</h3>
            </div>
            <div className="login-footer">
              <p>2021 АО "АМИАЦ"</p>
            </div>
          </div> 
      </div>
    </div>
  </>
)}
export default observer(LoginPage)