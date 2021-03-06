import { observer } from 'mobx-react-lite'
import { FC, useContext, useEffect, useState} from 'react'
import { Context } from '../..'
import { Card } from 'primereact/card'
import { CheckboxChangeParams } from 'primereact/checkbox'
import NullFlavorWrapper from '../NullFlavorWrapper'
import { NA, NULL_FLAVORS } from '../../utils/defaults'
import { IReference, IReferenceId } from '../../models/IReference'
import { Dropdown } from 'primereact/dropdown'
import { INullFlavorR } from '../../models/INullFlavor'
import { TRAFFIC_ACCIDENT } from '../../NSI/1.2.643.5.1.13.13.99.2.24'
import { PREGNANCY_CONNECTION } from '../../NSI/1.2.643.5.1.13.13.99.2.25'
import DoctorService from '../../services/DoctorService'
import Authenticator from '../../models/FormsData/Authenticator'
import { IAuthenticator } from '../../models/responses/IAuthenticator'

 const Section9: FC = () => {
  const { userStore, certificateStore, layoutStore } = useContext(Context)
   const certificate = certificateStore.cert 
  const [doctors, setDoctors] = useState<IReferenceId[] | null>(null)  
  useEffect(()=>{
    if (doctors===null && userStore.userInfo) {
      //layoutStore.isLoading = true
      DoctorService.getDoctors({       
        q:{organization_id_eq: userStore.userInfo.organization.id}        
      }).then(response=>{
        const data = response.data.map(doctor=>{
          if (!doctor.person || !doctor.person.person_name) return {id: doctor.id, name: doctor.position?.name } as IReferenceId
          return {id: doctor.id, name: `${doctor.person.person_name.family} ${doctor.person.person_name.given_1} ${doctor.person.person_name.given_2} ${doctor.position?.name}`} as IReferenceId})
        if (data) setDoctors(data)
      }).catch((err)=>console.log('ошибка загрузки списка врачей'))//.finally(()=>layoutStore.isLoading=false)
    }
  },[doctors, layoutStore, userStore.userInfo])
   
  const optionCode = 'NA'
  const options = NULL_FLAVORS.filter((item:IReference)=>optionCode.includes(item.code))  
  
  const header = () => {
      return <span>Прочие характеристики причины смерти</span>
    }
  
  const isTrafficAccident = !!certificate.trafficAccident || certificate.nullFlavors.findIndex((item)=>item.parent_attr==='traffic_accident')===-1
  const isPregnancyConnection = !!certificate.pregnancyConnection || certificate.nullFlavors.findIndex((item)=>item.parent_attr==='pregnancy_connection')===-1  
  const nullFlavorDropdnStyle = {minWidth:'210px', maxWidth:'500px', marginTop: '0.5rem', marginLeft: '-0.75rem'}
  const customDropdnStyle = {minWidth:'210px', maxWidth:'500px', marginTop: '0.5rem', marginLeft: '-1.25rem'}
  const customParagraphFieldStyle = {paddingTop: '0.1rem', width: '80%'} 
     
  return (<>    
      <Card className="c-section p-mr-2 p-mb-2" header={header}>        
          <div className="p-fluid p-formgrid p-grid">
            <div className="p-field p-d-flex p-flex-wrap p-jc-start" style={{width: '98%'}} >
              <div className='paragraph p-mr-1'>23.</div>
              <div className="p-paragraph-field p-mr-2 p-mb-2" style={{width: '90%'}}>                                  
                <NullFlavorWrapper paraNum  checked={isTrafficAccident}                                      
                  label={<label htmlFor="trafficAccident">В случае смерти в результате ДТП: смерть наступила –</label>}
                  setCheck={(e:CheckboxChangeParams, nullFlavors: INullFlavorR[] | undefined)=>{                      
                      if (!e.checked) certificate.trafficAccident = undefined                        
                      if (nullFlavors) certificate.nullFlavors = nullFlavors
                    }} 
                  field={
                    <Dropdown inputId="trafficAccident" style={nullFlavorDropdnStyle} placeholder="Выбрать"  
                      options={TRAFFIC_ACCIDENT} optionLabel="name" 
                      value={TRAFFIC_ACCIDENT.find((item)=> item.code === certificate.trafficAccident)} 
                      onChange={(e) =>certificate.trafficAccident =  e.value.code}                       
                    />             
                  }
                  options={options} 
                  value={NA} 
                  nullFlavors={certificate.nullFlavors}  
                  field_name="traffic_accident"
                />                               
              </div>              
            </div>
            <div className="p-field p-d-flex p-flex-wrap p-jc-start" style={{width: '98%'}} >
              <div className='paragraph p-mr-1'>24.</div>
              <div className="p-paragraph-field p-mr-2 p-mb-2"  
              style={{width: '90%'}}>                                  
                <NullFlavorWrapper paraNum  checked={isPregnancyConnection}                                      
                  label={<label htmlFor="pregnancyConnection"> В случае смерти беременной (независимо от срока и локализации) </label>}
                  setCheck={(e:CheckboxChangeParams, nullFlavors: INullFlavorR[] | undefined)=>{                      
                      if (!e.checked) {                        
                        certificate.pregnancyConnection = undefined                        
                      } 
                      if (nullFlavors) certificate.nullFlavors = nullFlavors
                    }} 
                  onChange={(e:IReference,  nullFlavors: INullFlavorR[] | undefined)=>{
                      if (nullFlavors) certificate.nullFlavors = nullFlavors}}
                  field={
                    <Dropdown inputId="pregnancyConnection" style={nullFlavorDropdnStyle} placeholder="Выбрать"  
                      options={PREGNANCY_CONNECTION} optionLabel="name" 
                      value={PREGNANCY_CONNECTION.find((item)=> item.code === certificate.pregnancyConnection)} 
                      onChange={(e) =>{
                        certificate.pregnancyConnection = e.value.code}
                      } 
                    />             
                  }
                  options={options} 
                  value={NA} 
                  nullFlavors={certificate.nullFlavors}  
                  field_name="pregnancy_connection"
                />                               
              </div>              
            </div> 
            <div className="p-field p-d-flex p-flex-wrap p-jc-start" style={{width: '98%', paddingLeft:'0.5rem',fontWeight:600, fontSize: 'larger'}} >
              Подписи 
            </div>
            <div className="p-field p-d-flex p-flex-wrap p-jc-start" style={{width: '98%'}}>
              <div className='paragraph p-mr-1'>25. </div>
              <div className="p-paragraph-field p-mr-2 p-mb-2" style={customParagraphFieldStyle}>
                <label htmlFor="author">Врач (фельдшер, акушерка), заполнивший Медицинское свидетельство о смерти *</label>
                <Dropdown inputId="author"  placeholder="Выбрать" style={customDropdnStyle}                   
                  optionLabel="name" autoFocus className="p-mb-2"  options={doctors || []} 
                  value={doctors?.find(item=>item.id === certificate.author?.doctorID)} showClear             
                  onChange={(e) =>{
                    if (e.value) { 
                      certificate.author = new Authenticator({doctor: e.value} as IAuthenticator)                     
                    } else certificate.author = undefined                       
                  }} />
                <label htmlFor="legalAuthenticator">Руководитель медицинской организации *</label>
                <Dropdown inputId="legalAuthenticator"  placeholder="Выбрать" style={customDropdnStyle} 
                  optionLabel="name" options={doctors || []} showClear
                  value={doctors?.find(item=>item.id === certificate.legalAuthenticator?.doctorID)}                
                  onChange={(e) =>{
                    if (e.value) { 
                      certificate.legalAuthenticator =  new Authenticator({doctor: e.value} as IAuthenticator)                     
                    } else certificate.legalAuthenticator = undefined                   
                  }} />  
              </div>               
            </div>
            <div className="p-field p-d-flex p-flex-wrap p-jc-start" style={{width: '98%'}}>
              <div className='paragraph p-mr-1'>26. </div>
              <div className="p-paragraph-field p-mr-2 p-mb-2" style={customParagraphFieldStyle}>
                <label htmlFor="authenticator">Свидетельство проверено ответственным *</label>
                <Dropdown inputId="authenticator" placeholder="Выбрать" style={customDropdnStyle} 
                  optionLabel="name"  options={doctors || []} showClear
                  value={doctors?.find(item=>item.id===certificate.authenticator?.doctorID)}                
                  onChange={e=>{
                    if (e.value) {
                      certificate.authenticator =  new Authenticator({doctor: e.value} as IAuthenticator)                      
                    } else certificate.authenticator = undefined
                  }} 
                />
              </div>  
            </div>
            <div className="p-field p-d-flex p-flex-wrap p-jc-start" style={{width: '98%', paddingLeft:'0.5rem'}} >
              <em>* Заполнить в день фактического подписания бумажного носителя</em>
            </div>     
          </div>          
      </Card>  
    </>)
  }
  export default observer(Section9) 