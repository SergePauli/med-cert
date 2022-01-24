import { Card } from 'primereact/card'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'

import '../styles/components/Calendar.css'
import '../styles/components/Divider.css'
import '../styles/components/Button.css'
import '../styles/pages/CertificatePage.css'

import { useContext, FC, useEffect, useRef } from 'react'
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
import { Context } from '..'
import { observer } from 'mobx-react-lite'
import { ISuggestions } from '../models/ISuggestions'
import { Toast } from 'primereact/toast'
import { DEFAULT_ERROR_TOAST } from '../utils/defaults'


interface IMatch extends IRouteMatch {  
  params: {id: number}
}
interface CertificatePageProps extends IRouteProps { 
    match: IMatch  
}

const CertificatePage: FC<CertificatePageProps> = (props: CertificatePageProps) => {  
  const { certificateStore, userStore, layoutStore } = useContext(Context)
  const toast = useRef<Toast>(null)  
  useEffect(()=>{
    if (userStore.userInfo) certificateStore.userInfo = userStore.userInfo
    certificateStore.getList()      
  },[certificateStore, userStore.userInfo])
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
      default: return <Section0 /> 
    } 
  }    
  const items = [        
        {
            label: 'Назад',
            icon: 'pi pi-chevron-left',
            command: () => {
              const section = Number.parseInt(props.location.search[props.location.search.length-1])-1             
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
                result
                .then(response=>{
                  certificateStore.clean()
                  certificateStore.select()
                  if (toast!==null && toast.current!==null) toast.current.show({ severity: 'success', summary: 'Успешно', detail: 'Запись удалена', life: 3000 })
                })
                .catch(reason=>{
                  console.log(reason)
                  if (toast!==null && toast.current!==null) 
                  toast.current.show(DEFAULT_ERROR_TOAST)
                })
                .finally(()=>layoutStore.isLoading = false)
              }
            }
        },
        {
            label: 'Сохранить',
            icon: 'pi pi-save p-success',
            command: () => { 
              layoutStore.isLoading = true
              const result = certificateStore.save()
              if (!result) {
                console.log('нет юзера')
                layoutStore.isLoading = false
              } else {
                result.then(response=>{   
                  layoutStore.isLoading = false               
                  if (toast!==null && toast.current!==null) toast.current.show({ severity: 'success', summary: 'Успешно', detail: 'Изменения сохранены', life: 3000 })
                  console.log(response.data)
                }).catch(err=>{       
                  layoutStore.isLoading = false           
                  if (toast!==null && toast.current!==null) 
                  toast.current.show(DEFAULT_ERROR_TOAST)
                  console.log(err)
                })
              }
                            
            }
        },
        {
            label: 'Создать',
            icon: 'pi pi-plus',
            command: () => { 
              try {
                certificateStore.createNew() 
                 if (toast!==null && toast.current!==null) toast.current.show({ severity: 'success', summary: 'Пустое  свидетельство создано!', detail: 'Внесите изменения и сохраните, чтоб получить номер', life: 3000 })
              } catch {if (toast!==null && toast.current!==null) 
                  toast.current.show(DEFAULT_ERROR_TOAST)}
            }
        },
        {
            label: 'Далее',
            icon: 'pi pi-chevron-right',
            command: () => {
              const section = Number.parseInt(props.location.search[props.location.search.length-1])+1              
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
  const sugCount = certificateStore.redSuggestionsCount() 
  const suggestionHeader = () => {    
    const avatar = sugCount === 0 ? <Avatar icon="pi pi-check" shape="circle" style={{ height:'1.5rem', width: '1.5rem',backgroundColor: 'rgb(104 159 56)', color: 'white'}}/> : <Badge value={sugCount}  style={{ backgroundColor: 'rgb(204, 0, 0)', color: 'white', marginLeft: '4px'}}/>
    return <><span>Контроль заполнения</span>{avatar}</>
  }
  const suggestions = certificateStore.suggestions
    .filter((item:ISuggestions) =>
    item.section === props.location.search.slice(-1))
  
  const layoutParams = {
    title: 'Медицинское свидетельство о смерти',     
    url: `${CERTIFICATE_ROUTE}/${props.match.params.id}${props.location.search}`,
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