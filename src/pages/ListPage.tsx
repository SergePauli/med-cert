import React, { useEffect, useState } from 'react';
import { FC } from 'react';

type ListPageProps = {}

export const ListPage: FC<ListPageProps> = (props: ListPageProps) => {
  const [state, setState] = useState();

  useEffect(() => {}, []);

  return (
    <>
      <h1>ListPage React TS FC Component</h1>
      <div>List</div>
    </>
  );
};