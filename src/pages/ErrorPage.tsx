import React, { useEffect, useState } from 'react';
import { FC } from 'react';

type ErrorPageProps = {}

export const ErrorPage: FC<ErrorPageProps> = (props: ErrorPageProps) => {
  const [state, setState] = useState();

  useEffect(() => {}, []);

  return (
    <>
      <h1>ErrorPage React TS FC Component</h1>
      <div>List</div>
    </>
  );
};