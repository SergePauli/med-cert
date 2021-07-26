import React, { useEffect, useState } from 'react';
import { FC } from 'react';

type CertificatePageProps = {}

export const CertificatePage: FC<CertificatePageProps> = (props: CertificatePageProps) => {
  const [state, setState] = useState();

  useEffect(() => {}, []);

  return (
    <>
      <h1>React TS FC Component</h1>
      <div>List</div>
    </>
  );
};