import { observer } from 'mobx-react-lite'
import React, { useContext } from 'react'
import { useState } from 'react'
import { FC } from 'react'
import { Context } from '..'


const LoginPage: FC = () => {
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const {store} = useContext(Context)
  return (
  <>
    <h1>Login Form</h1>
    <div>
      <input onChange={e => setEmail(e.target.value)}
        value={email}
        type="text"
        placeholder="email"
      />
      <input onChange={e => setPassword(e.target.value)}
        value={password}
        type="password"
        placeholder="password"
      />
      <button onClick={()=>store.login(email,password)}>login</button>    
      
    </div>
  </>
)}
export default observer(LoginPage)