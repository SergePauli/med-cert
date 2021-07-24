import React, { useContext } from 'react'
import { useState } from 'react'
import { FC } from 'react'
import { Context } from '..'


export const LoginPage: FC = () => {
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
      <button onClick={()=>store.logout()}>logout</button>
      <span style={{color: "#999999"}}>
        {store.user.email} {store.user.id} {store.user.roles}
      </span>
    </div>
  </>
)}