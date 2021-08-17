import { Card } from 'primereact/card'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'

import '../styles/components/Calendar.css'
import '../styles/components/Divider.css'
import '../styles/components/Button.css'
import '../styles/pages/CertificatePage.css'

import { useContext, FC } from 'react'
import MainLayout from '../components/layouts/MainLayout'
import { CERTIFICATE_ROUTE } from '../utils/consts'
import { Divider } from 'primereact/divider'
import { Button } from 'primereact/button'
import { Avatar } from 'primereact/avatar'
import { IRouteMatch } from '../models/IRouteMatch'
import { IRouteProps } from '../models/IRouteProps'
import Section0 from '../components/c_sections/section_0'
import Section1 from '../components/c_sections/section_1'
import { Context } from '..'

interface IMatch extends IRouteMatch {  
  params: {id: number}
}
interface CertificatePageProps extends IRouteProps { 
    match: IMatch  
}

export const CertificatePage: FC<CertificatePageProps> = (props: CertificatePageProps) => {  
  const { certificateStore, userStore } = useContext(Context)   
   const cert_number = certificateStore.series()
   console.log(cert_number, userStore.isAuth())
  const secton_router = ()=>{
    switch (props.location.search) {
      case "?q=0": return <Section0 />
      case "?q=1": return <Section1 />
      default: return <Section0 /> 
    } 
  }
  const suggestions = [
    {code:"У3-3", suggestion:"Необходимо выбрать тип свидетельства", done:true }
  ] 
  const doneBodyTemplate = (rowData:any) => {
        return rowData.done ? <Avatar icon="pi pi-check" shape="circle" style={{ color: 'rgb(104 159 56)'}}/>
        : ''
  }  
  const rowClass = (data:any) => {
    return {
      'p-suggestion-actual': !data.done
    }
  }  
  const suggestionHeader = () => {
    return <><span>Контроль формы</span>
      <Avatar icon="pi pi-check" shape="circle" style={{ backgroundColor: 'rgb(104 159 56)', color: 'white'}}/></>
  }
  const layoutParams = {
    title: 'Медицинское свидетельство о смерти',     
    url: `${CERTIFICATE_ROUTE}/${props.match.params.id}${props.location.search}`,
    content:(<>
      <div className="p-d-flex p-jc-center">
        {secton_router()}
        <Card className="p-mr-2 p-mb-2 p-suggestion" header={suggestionHeader}>            
            <DataTable className="p-datatable-sm" rowClassName={rowClass} value={suggestions}>
              <Column field="code" header="Код"></Column>
              <Column field="suggestion" header="Проверка"></Column>
              <Column body={doneBodyTemplate}></Column>
            </DataTable> 
        </Card>
      </div>
      <Divider style={{paddingTop:'1rem',marginBottom:'0.4rem'}}/>
      <div className="p-d-flex p-jc-center">
        <Button icon="pi pi-ban" className="p-button-danger p-button-action p-mr-4 p-mb-2 p-shadow-3"
         label="Отменить" disabled />
        <Button icon="pi pi-save" className="p-button-secondary p-button-action p-mr-4 p-mb-2 p-shadow-3" label="Сохранить" disabled />
        <Button icon="pi pi-angle-right" iconPos="right" className="p-button-action p-mr-4 p-mb-2 p-shadow-3"  label="Далее"  />  
      </div>
    </>)
  }  
  return (
    <>
      <MainLayout {...layoutParams} />
    </>
  )
}