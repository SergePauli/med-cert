import { observer } from 'mobx-react-lite'
import { FC, useContext, useState } from 'react'
import { Context } from '../..'
import { InputText } from 'primereact/inputtext'
import { Card } from 'primereact/card'
import { Checkbox, CheckboxChangeParams } from 'primereact/checkbox'
import { RadioButton } from 'primereact/radiobutton'
import '../../styles/components/RadioButton.css'
import '../../styles/components/Calendar.css'
import '../../styles/pages/CertificatePage.css'
import NullFlavorWrapper from '../NullFlavorWrapper'
import { ASKU, FEMALE, ID_CARD_TYPES, MALE, NA, NOGENDER, NULL_FLAVORS, PASSPORT_RF, UNK } from '../../utils/defaults'
import { IReference } from '../../models/IReference'
import { Calendar } from 'primereact/calendar'
import { INullFlavor } from '../../models/INullFlavor'
import { IPersonName } from '../../models/IPersonName'
import IIdentity from '../../models/IIdentity'
import Identity from '../../models/FormsData/Identity'


 const Section1: FC = () => {   
  const { certificateStore } = useContext(Context) 
  const certificate = certificateStore.cert   
  const patient = certificate.patient
  const person =  patient.person     
  const [yearBTChecked, setYearBTChecked] = useState<boolean>(patient.birth_year!==undefined)   
  const [yearDTChecked, setYearDTChecked] = useState<boolean>(certificate.deathYear!==undefined) 
   
  const fioChecked = true
  const header = () => {
      return <span>Данные умершего</span>
    }
    
  const identified = certificateStore.identified && person.fio !== undefined
  const fio = person.fio ? {...person.fio} : {family:'', given_1:'', given_2:''}  
  const optionCode = certificateStore.fromRelatives ? 'ASKU' : 'NA'
  const isDeathTime = certificate.deathDatetime!==undefined 
        && certificate.nullFlavors().findIndex((item)=>item.parent_attr==="death_time")===-1
  return (<>    
      <Card className="c-section p-mr-2 p-mb-2" header={header}>        
          <div className="p-fluid p-formgrid p-grid">
            <div className="p-field-checkbox p-col-12 p-lg-6">              
              <Checkbox inputId="notIdentified" checked={!certificateStore.identified} onChange={e =>{                
                if (e.checked) person.fio = undefined
                else { 
                  person.fio = fio
                  if (yearBTChecked) { setYearBTChecked(false) 
                    certificateStore.setBirthDay(patient.birth_date as Date | undefined, false)
                  }      
                }                
                certificateStore.identified = !e.checked  
                }} />
              <label htmlFor="notIdentified">Умерший не идентифицирован</label>
            </div>
            <div className="p-field-checkbox p-col-12 p-lg-6">              
              <Checkbox inputId="fromRelatives" checked={certificateStore.fromRelatives} 
              onChange={e =>{       
                certificateStore.fromRelatives = e.checked
                if (e.checked) { 
                  person.fio = fio                  
                  certificateStore.checkFio()
                  if (yearBTChecked) { 
                    setYearBTChecked(false) 
                    certificateStore.setBirthDay(patient.birth_date as Date | undefined, false)
                  }
                  patient.identity = undefined  
                  patient.nullFlavors().push({parent_attr:'identity', value:ASKU})                 
                } else 
                  patient.identity = new Identity({identityCardType: ID_CARD_TYPES[PASSPORT_RF].code} as IIdentity)
                certificateStore.checkIdentity() 
                }}/>
              <label htmlFor="fromRelatives">Внесено со слов родственников</label>
            </div>
            <div className="p-field p-d-flex p-flex-wrap p-jc-start">
              <div className='paragraph p-mr-1'> 1. </div>
              <div className='p-paragraph-field p-mr-2 p-mb-2' 
                key={`pdiv1_${identified}`} >
                <NullFlavorWrapper 
                  disabled={!certificateStore.fromRelatives}               
                  checked={identified} 
                  paraNum
                  setCheck={(e:CheckboxChangeParams, nullFlavors: INullFlavor[] | undefined)=>
                    { 
                      if (e.checked)  person.fio = fio
                      else person.fio = undefined 
                      if (nullFlavors) person.setNullFlavors(nullFlavors)    
                      certificateStore.checkFio()
                    }}                 
                  label={<label htmlFor="family">Фамилия</label>}
                  field={<InputText  id="family" value={fio.family} 
                  autoFocus type="text" 
                  onChange={(e)=>{                    
                    fio.family = e.target.value
                    person.fio = fio
                    certificateStore.checkFio()
                  }}/>}                  
                  options={NULL_FLAVORS.filter((item:IReference)=>optionCode.includes(item.code))} 
                  value={certificateStore.fromRelatives ? ASKU : NA} 
                  nullFlavors={person.nullFlavors()}  
                  field_name="person_name"                                 
                />             
              </div>
              <div className="p-paragraph-field p-mr-2 p-mb-2" 
              key={`pdiv2_${identified}`} style={{marginLeft:'1.5rem'}}>
                <NullFlavorWrapper                   
                  label={<label htmlFor="given_1">Имя</label>}
                  checked={identified}                   
                  field={
                    <InputText id="given_1" value={fio.given_1} 
                    type="text" 
                    onChange={(e)=>{
                      fio.given_1 = e.target.value
                      person.fio = fio                    
                      certificateStore.checkFio()                   
                  }}/>}
                  options={NULL_FLAVORS.filter((item:IReference)=>optionCode.includes(item.code))}                   
                  lincked                                    
                />  
              </div>
              <div className="p-paragraph-field" style={{marginLeft:'1.5rem'}} key={`pdiv3_${identified}`}>
                  <NullFlavorWrapper 
                    disabled={!identified}
                    label={<label htmlFor="given_2">Отчество</label>}
                    checked={identified && fioChecked} 
                    setCheck={(e:CheckboxChangeParams)=>{                      
                      const fi = {family: fio.family, given_1: fio.given_1} as IPersonName
                      if (e.checked)  fi.given_2='' 
                      person.fio = fi                     
                      certificateStore.checkFio() 
                      }                      
                    } 
                    field={               
                      <InputText id="given_2" type="text" 
                        value={fio.given_2}                         
                        onChange={(e)=>{ 
                          fio.given_2 = e.target.value                         
                          person.fio = fio                    
                          certificateStore.checkFio()}}
                      />
                    }
                    options={[NULL_FLAVORS[identified ? NA : ASKU]]} 
                    value={identified ? NA : ASKU} 
                    lincked={!identified}                                      
                  />
              </div>              
            </div>
            <div className="p-d-flex p-jc-center">
              <div className='paragraph p-mr-1' > 2. </div>
              <div className='p-paragraph-field'>
                <div className="p-formgroup-inline">
                  <div className='p-field-radiobutton p-radiobutton'>Пол</div>
                  <div className='p-field-radiobutton'>                  
                    <RadioButton name='undef' checked={patient.gender === NOGENDER}
                    onChange={(e)=>{
                      if (e.checked) patient.gender = NOGENDER  
                      else patient.gender = undefined
                      certificateStore.setGender(patient.gender)}
                      }/>
                    <label htmlFor='undef'> Неопределенный </label>
                  </div>
                  <div className='p-field-radiobutton'>                  
                    <RadioButton name='female' checked={patient.gender === FEMALE}
                      onChange={(e)=>{
                      if (e.checked) patient.gender = FEMALE  
                      else patient.gender = undefined
                      certificateStore.setGender(patient.gender)}
                      }/>
                    <label htmlFor='female'> Женский</label>
                  </div>                
                  <div className='p-field-radiobutton'>                  
                    <RadioButton name='male' checked={patient.gender === MALE}
                    onChange={(e)=>{
                      if (e.checked) patient.gender = MALE  
                      else patient.gender = undefined
                      certificateStore.setGender(patient.gender)}
                      }/>
                    <label htmlFor='male'>Мужской</label>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-field p-d-flex p-jc-center">
              <div className='paragraph p-mr-1'> 3. </div>
              <div className='p-paragraph-field' key={`pdiv5_${identified}`}>                    
                <NullFlavorWrapper paraNum
                    disabled={certificateStore.identified}                    
                    label={<label htmlFor="dateBirth">Дата рождения</label>}
                    checked={certificateStore.identified || yearBTChecked } setCheck={(e:CheckboxChangeParams, nullFlavors: INullFlavor[] | undefined)=>{                      
                      if (!e.checked) {                        
                        patient.birth_date = undefined
                        patient.birth_year = undefined 
                      } 
                      if (nullFlavors) patient.setNullFlavors(nullFlavors)    
                      certificateStore.checkBirthDay()
                    }} 
                    onChange={(e:IReference,  nullFlavors: INullFlavor[] | undefined)=>{if (nullFlavors) patient.setNullFlavors(nullFlavors)}}
                    field={<div className="p-d-flex p-jc-start p-ai-center">              
                      <Calendar id="dateBirth" className="p-mr-2" 
                        view={yearBTChecked ? "month" : "date"} dateFormat={yearBTChecked ? "yy" : "dd/mm/yy"}                          
                        value={patient.birth_date} 
                        onChange={(e)=>certificateStore.setBirthDay(e.target.value as Date | undefined, yearBTChecked)                          
                        }
                        showIcon />
                      <div className="p-field-checkbox">              
                        <Checkbox checked={yearBTChecked} 
                          inputId="bd_year" disabled={certificateStore.identified}
                          onChange={e=>{
                            setYearBTChecked(e.checked)
                            certificateStore.setBirthDay(patient.birth_date as Date | undefined, e.checked) }}/>
                        <label htmlFor="bd_year">Только год</label>
                      </div>
                    </div>}
                    options={NULL_FLAVORS.filter((item:IReference)=>"ASKU UNK".includes(item.code))} 
                    value={certificateStore.fromRelatives ? ASKU : UNK}
                    field_name="birth_date"
                    nullFlavors={patient.nullFlavors()}
                />                               
              </div>              
            </div>
            <div className="p-field p-d-flex p-jc-center">
              <div className='paragraph p-mr-1'> 7. </div>
              <div className='p-paragraph-field p-mr-3 p-mb-2'>
                <NullFlavorWrapper paraNum                   
                  label={<label htmlFor="dateDeath">Дата смерти</label>}                  
                  checked={certificate.deathDatetime!==undefined} setCheck={(e:CheckboxChangeParams, nullFlavors:      INullFlavor[] | undefined)=>{                   
                    if (!e.checked) certificateStore
                          .setDeathDay(undefined, false)                      
                    else certificateStore
                          .setDeathDay(new Date(), false)                         
                    if (nullFlavors) certificate.setNullFlavors(nullFlavors)  
                  }} 
                  onChange={(e:IReference,  nullFlavors: INullFlavor[] | undefined)=>{if (nullFlavors) certificate.setNullFlavors(nullFlavors)}}
                  field={<div className="p-d-flex p-jc-start p-ai-center">              
                      <Calendar id="dateDeath" className="p-mr-2" 
                        view={yearDTChecked ? "month" : "date"} dateFormat={yearDTChecked ? "yy" : "dd/mm/yy"} 
                        value={certificate.deathDatetime}
                        onChange={(e)=>certificateStore
                          .setDeathDay(e.target.value as Date | undefined, yearDTChecked) 
                        } 
                        showIcon />
                      <div className="p-field-checkbox">              
                        <Checkbox checked={yearDTChecked} 
                          inputId="bd_year" 
                          onChange={e=>{ setYearDTChecked(e.checked)
                            certificateStore
                          .setDeathDay(certificate.deathDatetime as Date | undefined, e.checked)}}/>
                        <label htmlFor="bd_year">Только год</label>
                      </div>
                    </div>}
                    options={NULL_FLAVORS.filter((item:IReference)=>"ASKU UNK".includes(item.code))} 
                    value={UNK}
                    field_name="death_datetime"                    
                    nullFlavors={certificate.nullFlavors()}
                 />
              </div>     
              <div className='p-paragraph-field' key={`pdivdt_${yearDTChecked}_${isDeathTime}`}>                
                <NullFlavorWrapper 
                  disabled={yearDTChecked}                   
                  label={<label htmlFor="timeDeath">Время смерти</label>}
                  checked={isDeathTime && !yearDTChecked} 
                  setCheck={(e:CheckboxChangeParams, nullFlavors: INullFlavor[] | undefined)=>{                   
                    if (nullFlavors) certificate.setNullFlavors(nullFlavors)    
                    certificateStore.checkDeathDay()
                  }}
                  onChange={(e:IReference,  nullFlavors: INullFlavor[] | undefined)=>{if (nullFlavors) certificate.setNullFlavors(nullFlavors)}} 
                  field={ <Calendar id="timeDeath"  
                    timeOnly hourFormat="24"             
                    value={certificate.deathDatetime} 
                    showIcon />}
                  options={NULL_FLAVORS.filter((item:IReference)=>"ASKU UNK".includes(item.code))} 
                  value={UNK}
                  field_name="death_time"
                  nullFlavors={certificate.nullFlavors()}                  
                />
              </div>
            </div>            
          </div>          
      </Card>  
    </>)
  }
  export default observer(Section1) 