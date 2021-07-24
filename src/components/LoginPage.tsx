import React from 'react';
import { useState } from 'react';
import { FC } from 'react';

type LoginPageProps = {}

export const LoginPage: FC = ({}: LoginPageProps) => {
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
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
      <button>login</button>
    </div>
  </>
)};