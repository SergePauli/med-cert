import { observer } from 'mobx-react-lite'
import { FC, useContext, useEffect} from 'react'
import { Context } from '../..'
import { Card } from 'primereact/card'
import { CheckboxChangeParams } from 'primereact/checkbox'
import '../../styles/components/RadioButton.css'
import '../../styles/components/Calendar.css'
import '../../styles/pages/CertificatePage.css'
import NullFlavorWrapper from '../NullFlavorWrapper'
import { DEATH_PLACE_TYPE_SUG, EDUCATION_LEVEL_SUG, MARITAL_STATUS_SUG, NA, NULL_FLAVORS, SOCIAL_STATUS_SUG, TERMS_PREGNANCY_SUG } from '../../utils/defaults'
import { IReference } from '../../models/IReference'

import { Dropdown } from 'primereact/dropdown'

import { DEAD_PLACE_TYPES } from '../../NSI/1.2.643.5.1.13.13.99.2.20'
import { MARITAL_STATUSES } from '../../NSI/1.2.643.5.1.13.13.99.2.15'
import { EDUCATION_LEVELS } from '../../NSI/1.2.643.5.1.13.13.99.2.16'
import { SOCIAL_STATUSES } from '../../NSI/1.2.643.5.1.13.13.11.1038'
import { INullFlavor } from '../../models/INullFlavor'
import { TERMS_PREGNANCY } from '../../NSI/1.2.643.5.1.13.13.99.2.18'
import { ChildInfo } from '../../models/FormsData/ChildInfo'
import { IChildInfo } from '../../models/IChildInfo'
import { MotherInfo } from '../MotherInfo'

 const Section5: FC = () => {
  const { certificateStore } = useContext(Context)
   
  const optionCode = 'NA'
  const options = NULL_FLAVORS.filter((item:IReference)=>optionCode.includes(item.code))  
  const defaultCode = NA 
  const header = () => {
      return <span>Прочие данные умершего</span>
    }
  const certificate = certificateStore.cert
  const isChildInfo = certificate.hoursAge() > 168 && certificate.yearsAge() < 1          
  const isMonthChild = isChildInfo && certificate.daysAge() < 30  
  useEffect(()=>{
    if (isChildInfo && certificate.childInfo===undefined) 
     certificate.childInfo = new ChildInfo({certificate_id: certificate.id} as IChildInfo)
    else if (!isChildInfo && certificate.childInfo!==undefined) certificate.childInfo = undefined
  },[isChildInfo,certificate, certificateStore.changeSuggestionsEntry])  
  const checkDeathPlaceType = () =>{
    certificateStore.changeSuggestionsEntry(DEATH_PLACE_TYPE_SUG, certificate.deathPlace === undefined)
  }
  const checkTermPregnancy = () =>{
      certificateStore.changeSuggestionsEntry(TERMS_PREGNANCY_SUG, certificate.childInfo!==undefined && certificate.childInfo.termPregnancy === undefined)
    }
  const checkEducationLevel = () =>{
    certificateStore.changeSuggestionsEntry(EDUCATION_LEVEL_SUG, certificate.educationLevel === undefined)
  }
  const checkMaritalStatus = () =>{
    certificateStore.changeSuggestionsEntry(MARITAL_STATUS_SUG, certificate.maritalStatus === undefined)
  }
  const checkSocialStatus = () =>{
    certificateStore.changeSuggestionsEntry(SOCIAL_STATUS_SUG, certificate.socialStatus === undefined)
  }
  const childInfo = certificate.childInfo 
  useEffect(()=>{    
    if (!isMonthChild && childInfo) childInfo.termPregnancy = undefined
    if (!isChildInfo && childInfo) {
      childInfo.weight = undefined
      childInfo.whichAccount = undefined
      childInfo.relatedSubject = undefined
    }
    certificateStore.changeSuggestionsEntry(TERMS_PREGNANCY_SUG, (isMonthChild && (childInfo===undefined || childInfo.termPregnancy === undefined)))
  }, [isMonthChild, childInfo, isChildInfo, certificateStore])
  const ddStyle = {minWidth:'210px', maxWidth:'500px', marginTop: '0.5rem', marginLeft: '-0.75rem'}
  const dDivStyle = {paddingTop: '0.1rem'}
      
  return (<>    
      <Card className="c-section p-mr-2 p-mb-2" header={header}>        
          <div className="p-fluid p-formgrid p-grid">            
            <div className="p-field p-d-flex p-flex-wrap p-jc-start">
              <div className='paragraph p-mr-1'>12. </div>
              <div className="p-paragraph-field p-mr-2 p-mb-2" style={dDivStyle}>
                <label htmlFor="deathPlaceType">Смерть наступила</label>
                <Dropdown inputId="deathPlaceType" style={ddStyle} placeholder="Выбрать"  
                  options={DEAD_PLACE_TYPES} optionLabel="name" autoFocus
                  value={DEAD_PLACE_TYPES.find((item)=>item.code === certificate.deathPlace)} 
                  onChange={(e) =>{
                    certificate.deathPlace = e.value.code
                    checkDeathPlaceType()
                  }} />
              </div>  
            </div> 
            <div className="p-field p-d-flex p-flex-wrap p-jc-start" style={{width: '98%'}}>
              <div className='paragraph p-mr-1'>13.*</div>
              <div className="p-paragraph-field p-mr-2 p-mb-2" style={{width: '90%'}}>
                <NullFlavorWrapper  checked={isMonthChild}  key={`MonthChild_${isMonthChild}`} 
                  disabled
                  setCheck={(e:CheckboxChangeParams, nullFlavors: INullFlavor[] | undefined)=>{
                            if (nullFlavors) certificate.setNullFlavors(nullFlavors)                  
                            if (!e.checked)  certificate.childInfo = undefined
                              checkTermPregnancy()
                            }}            
                  label={<label htmlFor="MonthChild">Для детей, умерших в возрасте от 168 час. до 1 месяца</label>}
                  field={<Dropdown inputId="MonthChild"  placeholder="Выбрать" autoFocus 
                    style={{minWidth:'210px', maxWidth:'300px'}}        
                    options={TERMS_PREGNANCY} optionLabel="name"
                    value={TERMS_PREGNANCY.find((item)=>item.code === certificate.childInfo?.termPregnancy)} 
                    onChange={(e) =>{                      
                      if (certificate.childInfo) certificate.childInfo.termPregnancy = e.value.code 
                      checkTermPregnancy()                    
                    }} />}
                  options={options} 
                  value={defaultCode} 
                  nullFlavors={certificate.nullFlavors()}  
                  field_name="term_pregnancy" paraNum 
                />    
              </div>  
            </div>
            <div className="p-field p-d-flex p-flex-wrap p-jc-start" style={{width: '98%'}} >
              <div className='paragraph p-mr-1'>14.*</div>
              <div className="p-paragraph-field p-mr-2 p-mb-2" style={{width: '90%'}}>
                <NullFlavorWrapper  checked={isChildInfo}  key={`YearChild_${isChildInfo}`} 
                  disabled
                  setCheck={(e:CheckboxChangeParams, nullFlavors: INullFlavor[] | undefined)=>{
                            if (nullFlavors) certificate.setNullFlavors(nullFlavors)                  
                              certificate.maritalStatus = undefined
                              checkMaritalStatus()
                            }}            
                  label={<label htmlFor="YearChild">Для детей, умерших в возрасте от 168 час. до 1 года</label>}
                  field={<MotherInfo childInfo={childInfo} onChange={(chInf: ChildInfo)=>{
                    if (certificate.childInfo !== chInf) certificate.childInfo = chInf  
                  }} />}
                  options={options} 
                  value={defaultCode} 
                  nullFlavors={certificate.nullFlavors()}  
                  field_name="related_subject" paraNum 
                />    
              </div>  
            </div>
            <div className="p-field p-d-flex p-flex-wrap p-jc-start">
              <div className='paragraph p-mr-1'>15.*</div>
              <div className="p-paragraph-field p-mr-2 p-mb-2" style={dDivStyle}>
                <label htmlFor="marital_status">Семейное положение</label>
                <Dropdown inputId="marital_status" style={ddStyle}
                  placeholder="Выбрать" autoFocus 
                  options={MARITAL_STATUSES} optionLabel="name"
                  value={MARITAL_STATUSES.find((item)=>item.code === certificate.maritalStatus)} 
                  onChange={(e) =>{certificate.maritalStatus= e.value.code
                      checkMaritalStatus()
                  }} 
                />                    
              </div>  
            </div>
            <div className="p-field p-d-flex p-flex-wrap p-jc-start">
              <div className='paragraph p-mr-1'>16.* </div>
              <div className="p-paragraph-field p-mr-2 p-mb-2" style={dDivStyle}>
                <label htmlFor="education_level">Образование</label>
                <Dropdown inputId="education_level" style={ddStyle}
                  placeholder="Выбрать" autoFocus 
                  options={EDUCATION_LEVELS} optionLabel="name"
                  value={EDUCATION_LEVELS.find((item)=>item.code === certificate.educationLevel)} 
                  onChange={(e) =>{
                    certificate.educationLevel = e.value.code
                    checkEducationLevel()
                  }} 
                />   
              </div>  
            </div>
            <div className="p-field p-d-flex p-flex-wrap p-jc-start">
              <div className='paragraph p-mr-1'>17.*</div>
              <div className="p-paragraph-field p-mr-2 p-mb-2" style={dDivStyle}>
                <label htmlFor="social_status">Занятость</label>
                <Dropdown inputId="social_status" style={ddStyle}
                  placeholder="Выбрать" autoFocus 
                  options={SOCIAL_STATUSES} optionLabel="name"
                  value={SOCIAL_STATUSES.find((item)=>item.code === certificate.socialStatus)} 
                  onChange={(e) =>{
                    certificate.socialStatus = e.value.code
                    checkSocialStatus()
                  }} 
                />    
              </div>  
            </div> 
            <div className="p-field p-d-flex p-flex-wrap p-jc-start" style={{width: '98%', paddingLeft:'0.5rem'}} >
              <em>* В случае смерти ребенка до года заполняется в отношении матери</em>
            </div>            
          </div>          
      </Card>  
    </>)
  }
  export default observer(Section5) 