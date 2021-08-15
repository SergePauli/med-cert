import { Card } from 'primereact/card'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Dropdown } from 'primereact/dropdown'
import { InputText } from 'primereact/inputtext'
import { Calendar } from 'primereact/calendar'
import '../styles/components/Calendar.css'
import '../styles/components/Divider.css'
import '../styles/components/Button.css'
import '../styles/pages/CertificatePage.css'
import { useEffect, useState } from 'react'
import { FC } from 'react'
import MainLayout from '../components/layouts/MainLayout'
import { CERTIFICATE_ROUTE, CERT_KIND } from '../utils/consts'
import { Divider } from 'primereact/divider'
import { Button } from 'primereact/button'
import { Avatar } from 'primereact/avatar'

type CertificatePageProps = {}

export const CertificatePage: FC<CertificatePageProps> = (props: CertificatePageProps) => {
  const [state, setState] = useState()

  useEffect(() => {}, [])
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
    url: CERTIFICATE_ROUTE,
    content:(
      <>
      <div className="p-d-flex p-jc-center">
        <Card className="p-mr-2 p-mb-2" style={{maxWidth:'500px'}}>
            <h5>Сведения о документе</h5>
            <div className="p-fluid p-formgrid p-grid">
                <div className="p-field p-col-12 p-md-6">
                  <label htmlFor="firstname6">Серия</label>
                  <InputText id="firstname6" disabled type="text" placeholder='Заполняется автоматически' />
                </div>
                <div className="p-field p-col-12 p-md-6">
                  <label htmlFor="lastname6">Номер</label>
                  <InputText id="lastname6" disabled type="text" placeholder='Заполняется автоматически'/>
                </div>              
                
                <div className="p-field p-col-12 p-md-6">
                  <label htmlFor="state">Вид свидетельства</label>
                  <Dropdown inputId="state"  placeholder="Выбрать" autoFocus 
                  options={CERT_KIND.filter((item)=>"1 2".includes(item.code))} optionLabel="name"/>
                </div>
                <div className="p-field p-col-12 p-md-6">                    
                  <label htmlFor="icon">Дата</label>
                  <Calendar id="icon"  dateFormat="dd/mm/yy" value={new Date()} disabled showIcon />
                </div>
            </div>
            <Divider/>
            <div className="p-grid p-mt-2">              
                <div className="p-col-6 p-d-flex p-flex-column p-jc-left p-ai-center p-flex-md-row p-flex-wrap">
                  <div className="overview-number p-mr-1 p-mb-1" style={{padding:'0.1rem'}}>Статус:</div>
                  <div className="overview-subtext p-mr-1 p-mb-1"style={{fontWeight:600,background: '#c8e6c9', color: '#256029', padding:'0.2rem'}}>АКТУАЛЬНОЕ</div>
                </div>
                <div className="p-col-6 p-d-flex p-flex-column p-jc-left p-ai-center p-flex-md-row p-flex-wrap"
                  style={{borderLeft:'1px #dee2e6', borderLeftStyle:'solid'}}>
                  <div className="overview-number p-mr-1 p-mb-1" style={{padding:'0.1rem'}}>Ранее выданные:</div>
                  <div className="overview-subtext p-mr-1 p-mb-1" style={{fontWeight:600,padding:'0.2rem'}}>НЕТ</div>
                </div>              
            </div>
        </Card>
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
      </>
    )
  }  
  return (
    <>
      <MainLayout {...layoutParams} />
    </>
  )
}