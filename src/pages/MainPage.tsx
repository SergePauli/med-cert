import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react';
import { FC } from 'react';
import { Context } from '..';

type MainPageProps = {}

const MainPage: FC<MainPageProps> = (props: MainPageProps) => {
  const [state, setState] = useState();
  const {userStore} = useContext(Context)
  useEffect(() => {}, []);

  return (
    <>
      <h1>MainPage React TS FC Component</h1>
      <button onClick={()=>userStore.logout()}>Выход</button>
    </>
  )
}
export default observer(MainPage)