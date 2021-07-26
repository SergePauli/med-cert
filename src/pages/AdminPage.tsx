import React, { useEffect, useState } from 'react';
import { FC } from 'react';

type AdminPageProps = {}

export const AdminPage: FC<AdminPageProps> = (props: AdminPageProps) => {
  const [state, setState] = useState();

  useEffect(() => {}, []);

  return (
    <>
      <h1>AdminPage React TS FC Component</h1>
      <div>List</div>
    </>
  );
};