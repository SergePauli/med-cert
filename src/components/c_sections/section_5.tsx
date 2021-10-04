import { observer } from 'mobx-react-lite'
import { FC, useContext } from 'react'
import { Context } from '../..'
import { Card } from 'primereact/card'
import { CheckboxChangeParams } from 'primereact/checkbox'
import '../../styles/components/RadioButton.css'
import '../../styles/components/Calendar.css'
import '../../styles/pages/CertificatePage.css'
import NullFlavorWrapper from '../NullFlavorWrapper'
import { ASKU, DEATH_PLACE_TYPE_SUG, EDUCATION_LEVEL_SUG, MARITAL_STATUS_SUG, NA, NULL_FLAVORS, SOCIAL_STATUS_SUG } from '../../utils/defaults'
import { IReference } from '../../models/IReference'

import { Dropdown } from 'primereact/dropdown'

import { DEAD_PLACE_TYPES } from '../../NSI/1.2.643.5.1.13.13.99.2.20'
import { MARITAL_STATUSES } from '../../NSI/1.2.643.5.1.13.13.99.2.15'
import { EDUCATION_LEVELS } from '../../NSI/1.2.643.5.1.13.13.99.2.16'
import { SOCIAL_STATUSES } from '../../NSI/1.2.643.5.1.13.13.11.1038'


 const Section5: FC = () => {
  const { certificateStore } = useContext(Context)   
  const identified = certificateStore.identified 
  const optionCode = certificateStore.fromRelatives ? 'ASKU' : 'NA'
  const header = () => {
      return <span>Прочие данные умершего</span>
    }
  const certificate = certificateStore.cert
  const checkDeathPlaceType = () =>{
    certificateStore.changeSuggestionsEntry(DEATH_PLACE_TYPE_SUG, certificate.deathPlace === undefined)
  }
  const checkEducationLevel = () =>{
    certificateStore.changeSuggestionsEntry(EDUCATION_LEVEL_SUG, certificate.educationLevel === undefined && 
     certificate.nullFlavors().findIndex((item)=>item.parent_attr==='education_level')===-1 )
  }
  const checkMaritalStatus = () =>{
    certificateStore.changeSuggestionsEntry(MARITAL_STATUS_SUG, certificate.maritalStatus === undefined && 
     certificate.nullFlavors().findIndex((item)=>item.parent_attr==='marital_status')===-1 )
  }
  const checkSocialStatus = () =>{
    certificateStore.changeSuggestionsEntry(SOCIAL_STATUS_SUG, certificate.maritalStatus === undefined && 
     certificate.nullFlavors().findIndex((item)=>item.parent_attr==='social_status')===-1 )
  }
      
  return (<>    
      <Card className="c-section p-mr-2 p-mb-2" header={header}>        
          <div className="p-fluid p-formgrid p-grid">            
            <div className="p-field p-d-flex p-flex-wrap p-jc-start" style={{width: '67%'}}>
              <div className='paragraph p-mr-1'>12. </div>
              <div className="p-paragraph-field p-mr-2 p-mb-2" style={{paddingTop: '0.1rem'}}>
                <label htmlFor="deathPlaceType">Смерть наступила</label>
                <Dropdown inputId="deathPlaceType" style={{marginTop: '0.5rem', marginLeft: '-0.75'}} placeholder="Выбрать"  
                  options={DEAD_PLACE_TYPES} optionLabel="name" autoFocus
                  value={DEAD_PLACE_TYPES.find((item)=>item.code === certificate.deathPlace)} 
                  onChange={(e) =>{
                    certificate.deathPlace = e.value.code
                    checkDeathPlaceType()
                  }} />
              </div>  
            </div> 
            <div className="p-field p-d-flex p-flex-wrap p-jc-start" style={{width: '98%'}} >
              <div className='paragraph p-mr-1'>15. </div>
              <div className="p-paragraph-field p-mr-2 p-mb-2">
                <NullFlavorWrapper  checked={identified}  key={`marital_status_${identified}`}               
                  label={<label htmlFor="marital_status">Семейное положение</label>}
                  field={<Dropdown inputId="marital_status"  placeholder="Выбрать" autoFocus 
                    options={MARITAL_STATUSES} optionLabel="name"
                    value={MARITAL_STATUSES.find((item)=>item.code === certificate.maritalStatus)} 
                    onChange={(e) =>{certificate.maritalStatus= e.value.code
                      checkMaritalStatus()
                    }} />}
                  options={NULL_FLAVORS.filter((item:IReference)=>optionCode.includes(item.code))} 
                  value={certificateStore.fromRelatives ? ASKU : NA} 
                  nullFlavors={certificate.nullFlavors()}  
                  field_name="marital_status" paraNum 
                />    
              </div>  
            </div>
            <div className="p-field p-d-flex p-flex-wrap p-jc-start" style={{width: '67%'}}>
              <div className='paragraph p-mr-1'>16. </div>
              <div className="p-paragraph-field p-mr-2 p-mb-2" >
                <NullFlavorWrapper  checked={identified}  key={`education_level_${identified}`}               
                  label={<label htmlFor="education_level">Образование</label>}
                  field={<Dropdown inputId="education_level"  placeholder="Выбрать" autoFocus 
                    options={EDUCATION_LEVELS} optionLabel="name"
                    value={EDUCATION_LEVELS.find((item)=>item.code === certificate.educationLevel)} 
                    onChange={(e) =>{
                      certificate.educationLevel = e.value.code
                      checkEducationLevel()
                    }} />}
                  options={NULL_FLAVORS.filter((item:IReference)=>optionCode.includes(item.code))} 
                  value={certificateStore.fromRelatives ? ASKU : NA} 
                  nullFlavors={certificate.nullFlavors()}  
                  field_name="education_level" paraNum  
                />    
              </div>  
            </div>
            <div className="p-field p-d-flex p-flex-wrap p-jc-start" style={{width: '98%'}} >
              <div className='paragraph p-mr-1'>17. </div>
              <div className="p-paragraph-field p-mr-2 p-mb-2">
                <NullFlavorWrapper  checked={identified}  key={`social_status_${identified}`}               
                  label={<label htmlFor="social_status">Занятость</label>}
                  field={<Dropdown inputId="social_status"  placeholder="Выбрать" autoFocus 
                    options={SOCIAL_STATUSES} optionLabel="name"
                    value={SOCIAL_STATUSES.find((item)=>item.code === certificate.socialStatus)} 
                    onChange={(e) =>{
                      certificate.socialStatus = e.value.code
                      checkSocialStatus()
                    }} />}
                  options={NULL_FLAVORS.filter((item:IReference)=>optionCode.includes(item.code))} 
                  value={certificateStore.fromRelatives ? ASKU : NA} 
                  nullFlavors={certificate.nullFlavors()}  
                  field_name="social_status" paraNum  
                />    
              </div>  
            </div>             
          </div>          
      </Card>  
    </>)
  }
  export default observer(Section5) 