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
import { Avatar } from 'primereact/avatar'
import { Badge } from 'primereact/badge'
import { IRouteMatch } from '../models/IRouteMatch'
import { IRouteProps } from '../models/IRouteProps'
import Section0 from '../components/c_sections/section_0'
import Section1 from '../components/c_sections/section_1'
import Section2 from '../components/c_sections/section_2'
import Section3 from '../components/c_sections/section_3'
import Section4 from '../components/c_sections/section_4'
import Section5 from '../components/c_sections/section_5'
import { Context } from '..'
import { observer } from 'mobx-react-lite'
import { ISuggestions } from '../models/ISuggestions'


interface IMatch extends IRouteMatch {  
  params: {id: number}
}
interface CertificatePageProps extends IRouteProps { 
    match: IMatch  
}

const CertificatePage: FC<CertificatePageProps> = (props: CertificatePageProps) => {  
  const { certificateStore } = useContext(Context)
  const secton_router = ()=>{
    switch (props.location.search) {
      case "?q=0": return <Section0 />
      case "?q=1": return <Section1 />
      case "?q=2": return <Section2 />
      case "?q=3": return <Section3 />
      case "?q=4": return <Section4 />
      case "?q=5": return <Section5 />
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
    const sugCount = certificateStore.redSuggestionsCount()
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
      <div className="p-d-flex p-jc-center">
        {secton_router()}
        <Card className="p-mr-2 p-mb-2 p-suggestion" header={suggestionHeader}>            
            <DataTable className="p-datatable-sm" rowClassName={rowClass} 
            value={suggestions}>
              <Column field="code" header="Код"></Column>
              <Column field="suggestion" header="Проверка"></Column>
              <Column body={doneBodyTemplate}></Column>
            </DataTable> 
        </Card>
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