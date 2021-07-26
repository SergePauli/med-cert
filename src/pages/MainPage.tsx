import React, { useEffect, useState } from 'react';
import { FC } from 'react';

type MainPageProps = {}

export const MainPage: FC<MainPageProps> = (props: MainPageProps) => {
  const [state, setState] = useState();

  useEffect(() => {}, []);

  return (
    <>
      <h1>MainPage React TS FC Component</h1>
      <div>List</div>
    </>
  );
};