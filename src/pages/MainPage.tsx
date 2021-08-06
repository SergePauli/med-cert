import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react';
import { FC } from 'react';
import { Context } from '..';
import { MainLayout, MainLayoutProps } from '../components/layouts/MainLayout';
import { HOME_ROUTE } from '../utils/consts';

type MainPageProps = {}

const MainPage: FC<MainPageProps> = (props: MainPageProps) => {
  const [state, setState] = useState();
  const {userStore} = useContext(Context)
  useEffect(() => {}, []);
  const layoutParams: MainLayoutProps = {
    isLayoutStaticInactive: false, 
    isTabletOrMobile: false, 
    url: HOME_ROUTE,
    content:( 
      <>     
        <h1>MainPage React TS FC Component</h1>
        <button onClick={()=>userStore.logout()}>Выход</button>
      </>
    )    
  }
  return (
    <>
      <MainLayout {...layoutParams} />
    </>
  )
}
export default observer(MainPage)