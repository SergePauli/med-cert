import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react';
import { FC } from 'react';
import { Context } from '..';
import MainLayout from '../components/layouts/MainLayout';
import { HOME_ROUTE } from '../utils/consts';

type MainPageProps = {}

const MainPage: FC<MainPageProps> = (props: MainPageProps) => {
  const [state, setState] = useState();
  const {userStore, layoutStore} = useContext(Context)
  useEffect(() => {}, []);
  const layoutParams= {
    title: 'Главная',     
    url: HOME_ROUTE,
    content:( 
      <>     
        <h1>MainPage React TS FC Component</h1>
        {`ml_lsi${layoutStore.layoutStaticInactive()}_tom${layoutStore.tabletOrMobile()}`}
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