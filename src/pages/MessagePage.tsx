import React, { useEffect, useState } from 'react';
import { FC } from 'react';

type MessagePageProps = {}

export const MessagePage: FC<MessagePageProps> = (props: MessagePageProps) => {
  const [state, setState] = useState();

  useEffect(() => {}, []);

  return (
    <>
      <h1>MessagePage React TS FC Component</h1>
      <div>List</div>
    </>
  );
};