import React, { useEffect, useState } from 'react'
import { FC } from 'react'
import { Route, Switch } from 'react-router-dom'
import { AUTH_ROUTES, PUBLIC_ROUTES } from '../routes'

type AppRouterProps = {}

export const AppRouter: FC<AppRouterProps> = (props: AppRouterProps) => {
  const [state, setState] = useState()

  useEffect(() => {}, [])
  const isAuth = false
  return (
    <Switch>
      {isAuth && AUTH_ROUTES.map(
        ({path, Component})=><Route key={path} path={path} component={Component} exact/>)
      }
      { PUBLIC_ROUTES.map(
        ({path, Component})=><Route key={path} path={path} component={Component} exact/>)
      }
    </Switch>
  )
}