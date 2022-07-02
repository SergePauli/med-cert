import { Card } from 'primereact/card'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'

import '../styles/components/Calendar.css'
import '../styles/components/Divider.css'
import '../styles/components/Button.css'
import '../styles/pages/CertificatePage.css'

import { useContext, FC, useEffect, useRef, useState } from 'react'
import MainLayout from '../components/layouts/MainLayout'
import { CERTIFICATE_ROUTE } from '../utils/consts'
import { Avatar } from 'primereact/avatar'
import { Badge } from 'primereact/badge'
import { IRouteMatch } from '../models/IRouteMatch'
import { IRouteProps } from '../models/IRouteProps'
import Section0 from '../components/c_sections/section_0'
import Section1 from '../components/c_sections/section_1'
import Section2 from '../components/c_sections/section_2'
import Section3 from '../components/c_sections/section_3'
import Section5 from '../components/c_sections/section_5'
import Section6 from '../components/c_sections/section_6'
import Section7 from '../components/c_sections/section_7'
import Section8 from '../components/c_sections/section_8'
import Section9 from '../components/c_sections/section_9'
import Section10 from '../components/c_sections/section_10'
import { Context } from '..'
import { observer } from 'mobx-react-lite'
import { ISuggestions } from '../models/ISuggestions'
import { Toast, ToastMessageType } from 'primereact/toast'
import { CERT_TYPE_SUG, DEFAULT_ERROR_TOAST, PERSON_NAME_SUG } from '../utils/defaults'
import { ICertificate } from '../models/responses/ICertificate'


interface IMatch extends IRouteMatch {  
  params: {id: string}
}
interface CertificatePageProps extends IRouteProps { 
    match: IMatch  
}

const CertificatePage: FC<CertificatePageProps> = (props: CertificatePageProps) => {  
  const { certificateStore, userStore, layoutStore, suggestionsStore } = useContext(Context)     
  const [certID, setCertID] = useState(Number.parseInt(props.match.params.id))
  const [message, setMessage] = useState<ToastMessageType | null>(null)
  //вывод попап-сообщения 
  useEffect(()=>{
    if (!!message) {
      layoutStore.message = message
      setMessage(null)
    }
  },[layoutStore, message])
  //привязка индикатора лоадера раскладки к индикатору загрузки стора свидетельств
  useEffect(()=>{
    layoutStore.isLoading = certificateStore.isLoading
  },[certificateStore.isLoading, layoutStore]) 
  
  //смена сертификата
  useEffect(()=>{ 
   // console.log('certID-',certID,' certificateStore.cert.id-',certificateStore.cert.id)  
    
  if (certID === certificateStore.cert.id || certID===-1) {
      layoutStore.isLoading = false
      return
    }  
    let _idx = -1
    const cArray = certificateStore.certs   
    if (cArray.length>0){            
      _idx = cArray.findIndex(el=>el.id === certID)      
    }
    if (_idx>-1) { 
      certificateStore.select(_idx)
      layoutStore.isLoading = false
    } else {      
      certificateStore.findById(certID, ()=>{layoutStore.isLoading = false})
    }  
  },[certID, certificateStore, layoutStore, certificateStore.cert.id])
  
  //очистка буфера сообщений 
  useEffect(()=>{
    if (!layoutStore.isLoading && !!layoutStore.message && !!toast.current) { 
      toast.current.show(layoutStore.message)
      layoutStore.message = null
    }
  },[layoutStore, layoutStore.isLoading, layoutStore.message])

  const toast = useRef<Toast>(null)  
  const secton_router = ()=>{
    switch (props.location.search) {
      case "?q=0": return <Section0 />
      case "?q=1": return <Section1 />
      case "?q=2": return <Section2 />
      case "?q=3": return <Section3 />      
      case "?q=5": return <Section5 />
      case "?q=6": return <Section6 />
      case "?q=7": return <Section7 />
      case "?q=8": return <Section8 />
      case "?q=9": return <Section9 />
      case "?q=10": return <Section10 />
      default: return <Section0 /> 
    } 
  }    
  const items = [        
        {
            label: 'Назад',
            icon: 'pi pi-chevron-left',
            command: () => {
              let section = Number.parseInt(props.location.search[props.location.search.length-1])-1             
              if (section===4) section--
                if (section > -1) {               
                userStore.history().push(`${CERTIFICATE_ROUTE}/${certificateStore.cert.id}?q=${section}`)
              }
            }
        },
        {
            label: 'Удалить',
            icon: 'pi pi-trash p-danger',
            command: () => {
              layoutStore.isLoading = true
              const result = certificateStore.delete()
              if (!result) {
                layoutStore.isLoading = false
              } else {
                result.then(response=>{                  
                  certificateStore.clean() 
                  layoutStore.isLoading = false
                  //setCertID(certificateStore.cert.id)                                  
                  setMessage({ severity: 'success', summary: 'Успешно', detail: 'Запись удалена', life: 3000 })                                 
                })
                .catch(reason=>{
                  layoutStore.isLoading = false
                  console.log(reason)
                  setMessage((DEFAULT_ERROR_TOAST))
                })                
              }
            }
        },
        {
            label: 'Сохранить',
            icon: 'pi pi-save p-success',
            command: () => { 
              if (!suggestionsStore.suggestions[CERT_TYPE_SUG].done || !suggestionsStore.suggestions[PERSON_NAME_SUG].done ) {
                 setMessage({severity:'warn', summary:'ОТКЛОНЕНО', detail:'Внесите минимальный набор данных: вид свидетельства, ФИО умершего(для идентифицированых)', life: 6000})
                 return
               }              
              const result = certificateStore.save((data:ICertificate)=>{                                
                  setMessage({ severity: 'success', summary: 'Успешно', detail: 'Изменения сохранены', life: 3000 })
                  setCertID(data.id)                   
              }, (message:string)=>{                         
                setMessage(DEFAULT_ERROR_TOAST)
                console.log(message)
              }, userStore.userInfo?.organization.sm_code)
              if (!result) {
                console.log('нет юзера')                
              }                
            }
        },    
        {
            label: 'Создать',
            icon: 'pi pi-plus',
            command: () => { 
              try {
                certificateStore.createNew()
                setCertID(-1)      
                setMessage({ severity: 'success', summary: 'Пустое  свидетельство создано!', detail: 'Внесите минимальные изменения и сохраните, чтоб получить номер', life: 3000 })                   
              } catch { 
                setMessage(DEFAULT_ERROR_TOAST)
              }
            }  
        },
        {
            label: 'Заменить',
            icon: 'pi pi-sync',            
            command: () => { 
              if (certificateStore.cert.id < 0 || !certificateStore.cert.issueDate) {
                setMessage({severity:'warn', summary:'ОТКЛОНЕНО', detail:'Замена возможна только для выданных свидетельств'})
              return  
              }
              try {
                certificateStore.replace()
                setCertID(-1) 
                setMessage({ severity: 'success', summary: 'Cвидетельство заменено!', detail: 'Проверьте вид и сохраните, чтоб получить номер', life: 3000 })                        
              } catch { 
                setMessage(DEFAULT_ERROR_TOAST)
              }
            }  
        },
        {
            label: 'Далее',
            icon: 'pi pi-chevron-right',
            command: () => {
              let section = Number.parseInt(props.location.search[props.location.search.length-1])+1              
              if (section===4) section++
              if (section > -1) {
                userStore.history().push(`${CERTIFICATE_ROUTE}/${certificateStore.cert.id}?q=${section}`)
              } 
            }
        },        
        

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
  const sugCount = suggestionsStore.redSuggestionsCount() 
  const suggestionHeader = () => {    
    const avatar = sugCount === 0 ? <Avatar icon="pi pi-check" shape="circle" style={{ height:'1.5rem', width: '1.5rem',backgroundColor: 'rgb(104 159 56)', color: 'white'}}/> : <Badge value={sugCount}  style={{ backgroundColor: 'rgb(204, 0, 0)', color: 'white', marginLeft: '4px'}}/>
    return <><span>Контроль заполнения</span>{avatar}</>
  }
  const suggestions = suggestionsStore.suggestions
    .filter((item:ISuggestions) =>
    item.section === props.location.search.slice(3))
  
  const layoutParams = {
    title: 'Медицинское свидетельство о смерти',     
    url: `${CERTIFICATE_ROUTE}/${certID}${props.location.search}`,
    content:(<>      
      <div className="p-d-flex p-jc-center" >        
        {secton_router()}        
        <Card className="p-mr-2 p-mb-2 p-suggestion"
         key={`p_sug_${sugCount}`} header={suggestionHeader}>                        
            <DataTable className="p-datatable-sm" rowClassName={rowClass} 
            value={suggestions} responsiveLayout="scroll">
              <Column field="code" header="Код"></Column>
              <Column field="suggestion" header="Проверка"></Column>
              <Column body={doneBodyTemplate}></Column>
            </DataTable> 
        </Card>
      </div>   
      <Toast ref={toast} />   
    </>),
    actionItems: items
  } 
  return (
    <>
      <MainLayout {...layoutParams} />
    </>
  )
}
export default observer(CertificatePage) 