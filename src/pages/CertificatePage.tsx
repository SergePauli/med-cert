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
import { Badge } from 'primereact/badge'
import { IRouteMatch } from '../models/IRouteMatch'
import { IRouteProps } from '../models/IRouteProps'
import Section0 from '../components/c_sections/section_0'
import Section1 from '../components/c_sections/section_1'
import { Context } from '..'
import { useState } from 'react'
import { useEffect } from 'react'
import { observer } from 'mobx-react-lite'

interface IMatch extends IRouteMatch {  
  params: {id: number}
}
interface CertificatePageProps extends IRouteProps { 
    match: IMatch  
}
interface ISuggestions{
  code: string
  suggestion: string
  done: boolean
}
const CertificatePage: FC<CertificatePageProps> = (props: CertificatePageProps) => {  
  const { certificateStore } = useContext(Context)   
  const [suggestions, setSuggestions] = useState<ISuggestions[]>([])
  const isCert_type = certificateStore.isCert_type()
   useEffect(()=>{setSuggestions([
     {code:"У3-3", suggestion:"Необходимо выбрать тип свидетельства", done:isCert_type}
   ])},[isCert_type, certificateStore]) 
  
  const secton_router = ()=>{
    switch (props.location.search) {
      case "?q=0": return <Section0 />
      case "?q=1": return <Section1 />
      default: return <Section0 /> 
    } 
  }
    
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
    const avatar = isCert_type ? <Avatar icon="pi pi-check" shape="circle" style={{ height:'1.5rem', width: '1.5rem',backgroundColor: 'rgb(104 159 56)', color: 'white'}}/> : <Badge value="1"  style={{ backgroundColor: 'rgb(204, 0, 0)', color: 'white'}}/>
    return <><span>Контроль формы</span>{avatar}</>
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
export default observer(CertificatePage) 