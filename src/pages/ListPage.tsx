import { observer } from 'mobx-react-lite'
import { Context } from '..'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Toast } from 'primereact/toast'
import { useEffect, FC, useContext, useRef, useState } from 'react'
import MainLayout from '../components/layouts/MainLayout'
import { CERTIFICATE_ROUTE, LIST_ROUTE } from '../utils/consts'
import { ICertificate } from '../models/responses/ICertificate'
import React from 'react'
import { Button } from 'primereact/button'
import { GENDERS } from '../NSI/1.2.643.5.1.13.13.11.1040'
import { DEAD_PLACE_TYPES } from '../NSI/1.2.643.5.1.13.13.99.2.20'
import { BASIS_DERMINING } from '../NSI/1.2.643.5.1.13.13.99.2.23'
import '../styles/components/DataTable.css'
import { CERT_TYPES } from '../NSI/1.2.643.5.1.13.13.99.2.19'
import { getOneLinePersonName } from '../models/IPersonName'


type ListPageProps = {}

const ListPage: FC<ListPageProps> = (props: ListPageProps) => {
  const {certificateStore, userStore, layoutStore} = useContext(Context)  
  const toast = useRef<Toast>(null)
  const dt = useRef(null)
  useEffect(()=>{
    if (userStore.userInfo) certificateStore.userInfo = userStore.userInfo
    layoutStore.isLoading = true
    certificateStore.getList(()=>layoutStore.isLoading = false)         
  },[certificateStore, layoutStore, userStore.userInfo])

  const [selected, setSelected] = useState<ICertificate | undefined>()

  const orderNumberBodyTemplate = (rowData: ICertificate)=>{
    const idx = certificateStore.certs.indexOf(rowData)+1
    return <i>{idx}</i>
  }
  const seriesNumberBodyTemplate = (rowData: ICertificate)=>{   
    const cert_type = CERT_TYPES.find(el=>el.code===rowData.cert_type) 
    return <>{rowData.series} {rowData.number} {cert_type?.s_name}</>
  }
  const reasonsBodyTemplate = (rowData: ICertificate)=>{
    const acme = rowData.reason_ACME
    const isACME = !!acme
    const cr = rowData.c_reason?.diagnosis
    const ar = rowData.a_reason?.diagnosis
    const br = rowData.b_reason?.diagnosis
    const dr = rowData.d_reason?.ext_diagnosis
    let result = isACME && !!cr && acme === cr.ICD10 ? 
      `(ПП-${acme})${cr.s_name}; ` : !!cr ? `(В-${cr.ICD10})${cr.s_name}; ` : ''
    result += (isACME && !!ar && acme === ar.ICD10 ? `(ПП-${acme})${ar.s_name}; ` : 
          !!ar ? `(А-${ar.ICD10})${ar.s_name}; ` : '')
    result += (isACME && !!br && acme === br.ICD10 ? `(ПП-${acme})${br.s_name}; ` : 
          !!br ? `(Б-${br.ICD10})${br.s_name}; ` : '')
    result += (isACME && !!dr && acme === dr.ICD10 ? `(ПП-${acme})${dr.s_name}; ` : 
          !!dr ? `(Г-${dr.ICD10})${dr.s_name}; ` : '')
    if (rowData.death_reasons && rowData.death_reasons.length>0) { 
      result +="Сопутствующие: " 
      rowData.death_reasons.forEach(el=>{
        result +=`(${el.diagnosis?.ICD10})${el.diagnosis?.s_name}; `
      })          
    }
    return <span style={{fontSize:'smaller'}}>{result}</span>
  }

  const datesBodyTemplate = (rowData: ICertificate)=>{
    let _result =''
    const birth = rowData.patient?.birth_date
    if (!!birth) _result = `${birth.slice(8,10)}.${birth.slice(5,7)}.${birth.slice(0,4)}`
    const death = !rowData.death_datetime ? !rowData.death_year ? false : rowData.death_year.toString() : rowData.death_datetime 
    if (death && death.length>4) {
       if (_result.length>0)_result += `-${death?.slice(8,10)}.${death.slice(5,7)}.${death.slice(0,4)}`
       else _result = `?-${death?.slice(8,10)}.${death.slice(5,7)}.${death.slice(0,4)}`
    } else if (death && death.length<5){
       if (_result.length>0)_result += `-${death}`
       else _result = `?-${death}`
    } else if (!death && _result.length>0) {
      _result += '-?'
    }  
    return _result
  }  
  const ageBodyTemplate = (rowData: ICertificate)=>{
    if (!rowData.death_datetime || !rowData.patient?.birth_date) return ''   
    const dd = new Date(rowData.death_datetime)
    const db = new Date(rowData.patient?.birth_date)
    let age = dd.getFullYear() - db.getFullYear()
    const m = dd.getMonth() - dd.getMonth()
    if (m < 0 || (m === 0 && dd.getDate() < db.getDate())) age--    
    return age
  }

  const genderBodyTemplate = (rowData: ICertificate)=>{
    if (!rowData.patient?.gender) return ''
    else return GENDERS[rowData.patient.gender-1].name.slice(0,1)
  }

  const fioBodyTemplate = (rowData: ICertificate)=>{
      if (!rowData.patient) return ""
      else if (!rowData.patient.person) return "не иденти-фицирован"          
      const result = getOneLinePersonName(rowData.patient.person.person_name)
      return <>{result}</>
    }
  const deathPlaceBodyTemplate = (rowData: ICertificate) => {
    if (!rowData.death_place) return ''
    else {
     const place = DEAD_PLACE_TYPES.find(el=>el.code === rowData.death_place)
     if (!place) return ''
     else return <span style={{fontSize:'small'}}>{place.name}</span>
    }      
  }   
  const basisDeterminingBodyTemplate = (rowData: ICertificate) => {
    if (!rowData.basis_determining) return ''
    else {
     const basis = BASIS_DERMINING.find(el=>el.code === rowData.basis_determining)
     if (!basis) return ''
     else return <span style={{fontSize:'small'}}>{basis.name}</span>
    }      
  }
  const custodianBodyTemplate = (rowData: ICertificate) => {
    const cusName = rowData.custodian?.name
    if (!cusName) return ''
    else return <span style={{fontSize:'small'}}>{cusName}</span>
  }  

  const custodian = userStore.userInfo?.roles.includes('MIAC') ? 
    <Column  header="Мед. организация" body={custodianBodyTemplate}                      
                      style={{ flexGrow: 1, flexBasis: '100px' }}> </Column> :
    <></>                  
  const doctorBodyTemplate = (rowData: ICertificate) => {
    if (!rowData.author) return ''
    else {       
      const result = getOneLinePersonName(rowData.author.doctor.person_name)
      return  <span style={{fontSize:'small'}}>{result}</span>
    }      
  }
  const positionBodyTemplate = (rowData: ICertificate) => {
    if (!rowData.author?.doctor.position ) return ''
    else return  <span style={{fontSize:'small'}}>{rowData.author.doctor.position.name}</span>         
  }
  
  const issueDateBodyTemplate = (rowData: ICertificate) => {
    const iDate = rowData.issue_date
    if (!iDate ) return ''    
    else return  <span style={{fontSize:'small'}}>{`${iDate.slice(8,10)}.${iDate.slice(5,7)}.${iDate.slice(0,4)}`}</span>         
  }

  const actionBodyTemplate = (rowData: ICertificate) => {       
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={()=>userStore.history().push(`${CERTIFICATE_ROUTE}/${rowData.id}?q=0`)} />
                
            </React.Fragment>
        )
    }    
  const layoutParams = {
        title: 'СПИСОК СВИДЕТЕЛЬСТВ',     
        url: LIST_ROUTE,
        content:
        <>
          <Toast ref={toast} />
          <div id='tableDiv' className='p-card' >             
              <DataTable ref={dt} value={certificateStore.certs}  responsiveLayout="scroll" scrollDirection="both"
                emptyMessage="нет данных, удовлетворяющих запросу" scrollable scrollHeight="76vh" 
                selectionMode="single" selection={selected}  dataKey="id" size="small"
                onSelectionChange={e =>{
                  certificateStore.select(certificateStore.certs.findIndex(el=>el.id === e.value.id))
                  setSelected(e.value)
                }}
                onRowDoubleClick={()=>userStore.history().push(`${CERTIFICATE_ROUTE}/${certificateStore.cert.id}?q=0`)}>  
                    <Column header="№ п.п"  body={orderNumberBodyTemplate}
                      style={{ flexGrow: 1, flexBasis: '38px' }} frozen></Column>                                   
                    <Column header="Серия Номер Вид" body={seriesNumberBodyTemplate} 
                       style={{ flexGrow: 1, flexBasis: '90px' }} frozen></Column>
                    <Column header="Причины смерти и соп. патологии"  
                      style={{ flexGrow: 1, flexBasis: '250px' }} body={reasonsBodyTemplate}></Column>
                    <Column  header="ФИО" body={fioBodyTemplate} 
                      style={{ flexGrow: 1, flexBasis: '140px' }}>  </Column>                    
                    <Column  header="Даты" body={datesBodyTemplate} 
                      style={{ flexGrow: 1, flexBasis: '110px' }}> </Column>
                    <Column  header="Лет" body={ageBodyTemplate} 
                      style={{ flexGrow: 1, flexBasis: '46px' }}> </Column>
                    <Column  header="Пол" body={genderBodyTemplate}
                      style={{ flexGrow: 1, flexBasis: '46px' }}> </Column>    
                    <Column  header="Адрес проживания" 
                      field='patient.person.address.streetAddressLine'
                      style={{ flexGrow: 1, flexBasis: '200px' }}> </Column>  
                    <Column  header="Адрес смерти" 
                      field='death_addr.streetAddressLine'
                      style={{ flexGrow: 1, flexBasis: '200px' }}> </Column>                     
                    <Column  header="Смерть наступила" body={deathPlaceBodyTemplate}
                      style={{ flexGrow: 1, flexBasis: '130px' }}> </Column>  
                    <Column  header="Основание заключения" body={basisDeterminingBodyTemplate}
                      style={{ flexGrow: 1, flexBasis: '130px' }}> </Column>
                    {custodian}
                    <Column  header="Специалист" body={doctorBodyTemplate}
                      style={{ flexGrow: 1, flexBasis: '120px' }}> </Column>
                    <Column  header="Должность" body={positionBodyTemplate}
                      style={{ flexGrow: 1, flexBasis: '130px' }}> </Column>  
                    <Column  header="Выдано" body={issueDateBodyTemplate}
                      style={{ flexGrow: 1, flexBasis: '100px' }}> </Column>                
                    <Column body={actionBodyTemplate} exportable={false} 
                      style={{ flexGrow: 1, flexBasis: '100px' }}></Column>
                </DataTable>
          </div>  
        </>
    }

 return (
    <>
      <MainLayout {...layoutParams} />
    </>
 )  
}
export default observer(ListPage)