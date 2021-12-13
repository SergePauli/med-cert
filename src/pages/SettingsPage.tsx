import { FC, useEffect, useState } from 'react'
import { IRouteMatch } from '../models/IRouteMatch'
import { IRouteProps } from '../models/IRouteProps'
import ava from '../images/hospital.jpg'
import '../styles/pages/ProfilePage.css'
import { MO_SETTINGS_ROUTE} from '../utils/consts'
import MainLayout from '../components/layouts/MainLayout'
import OrganizationService from '../services/OrganizationService'
import { IOrganization } from '../models/IOrganization'
import { Inplace, InplaceContent, InplaceDisplay } from 'primereact/inplace'
import { InputText } from 'primereact/inputtext'
import { ProgressSpinner } from 'primereact/progressspinner'
import { IAudit } from '../models/IAudit'

// страница настроек профиля организации
// Organization profile page

// используем роут с параметром id для загрузки с API
interface IMatch extends IRouteMatch {  
  params: {id: number}
}
interface SettingsPageProps extends IRouteProps { 
    match: IMatch  
}


export const SettingsPage: FC<SettingsPageProps> = (props: SettingsPageProps) =>{ 
  const [audits, setAudits] = useState<IAudit[]>([])
  const changesAudit = (fieldName: string, field: string, oldValue: string, newValue: string) => {
    let _audits = audits
    const audit = _audits.find(element=>element.field === field) || {field, before: oldValue} as IAudit
    if (audit.after === undefined) _audits.push(audit)    
    audit.after = newValue   
    audit.detail = `${fieldName}: ${audit.before} -> ${audit.after}`     
    setAudits(_audits)
  }
  const [organization, setOrganization] = useState<IOrganization | null>(null)
  useEffect(()=>{
    if (organization===null && props.match.params.id) {
      OrganizationService.getOrganization(props.match.params.id)
      .then(response=>{        
        setOrganization(response.data)
      })
    }
  },[organization, props.match.params.id])
  
  const layoutParams = {
    title: 'Профиль медорганизации',     
    url: MO_SETTINGS_ROUTE,
    content: organization ? (<>  
    <div className="card widget-user-card">
      <div className="user-card-header">
        <img src={ava} alt="" className="user-card-avatar" />
      </div>
      <div className="user-card-body">        
          <Inplace closable>
            <InplaceDisplay>
              <div className="user-card-title">
                {organization.name || ''}
              </div>
            </InplaceDisplay>
            <InplaceContent>
              <InputText value={organization.name || ''} 
                onChange={e=>{
                  let _organization = {...organization}
                  changesAudit("Наименование", "name", _organization.name || '', e.target.value || '')
                   _organization.name = e.target.value
                  setOrganization(_organization) 
                }}/>
            </InplaceContent>
          </Inplace>    
        <div className="user-card-subtext">{organization?.name_full}</div>
        <div className="p-grid user-card-stats">
          <div className="p-col-4">
            <i className="pi pi-users"></i>
            <div>14 Создано</div>
          </div>
          <div className="p-col-4">
            <i className="pi pi-bookmark"></i>
            <div>2 Выданно</div>
          </div>
          <div className="p-col-4">
            <i className="pi pi-check-square"></i>
            <div>6 Отправленно</div>
          </div>
        </div>
      </div>
    </div>      
  </>) : (<ProgressSpinner/>)
  }
  return (
    <>
      <MainLayout {...layoutParams} />
    </>
  )
}