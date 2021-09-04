import { observer } from 'mobx-react-lite'
import React, { FC, useContext, useState } from 'react'
import { Context } from '../..'
import { InputText } from 'primereact/inputtext'
import { Card } from 'primereact/card'
import { Checkbox, CheckboxChangeParams } from 'primereact/checkbox'
import { RadioButton } from 'primereact/radiobutton'
import '../../styles/components/RadioButton.css'
import '../../styles/components/Calendar.css'
import '../../styles/pages/CertificatePage.css'
import NullFlavorWrapper from '../NullFlavorWrapper'
import { ASKU, FEMALE, MALE, NA, NOGENDER, NULL_FLAVORS, UNK } from '../../utils/defaults'
import { IReference } from '../../models/IReference'
import { Calendar } from 'primereact/calendar'
import { INullFlavor } from '../../models/INullFlavor'
import { IPersonName } from '../../models/IPersonName'


 const Section1: FC = () => {
   const { certificateStore } = useContext(Context)   
   const [fromRelatives, setFromRelatives] = useState<boolean>(false)    
   const [yearBTChecked, setYearBTChecked] = useState<boolean>(false)   
   const [yearDTChecked, setYearDTChecked] = useState<boolean>(false) 
   const identified = certificateStore.identified
   
   const fioChecked = true
  const header = () => {
      return <span>Данные умершего</span>
    }
  const certificate = certificateStore.cert   
  const patient = certificate.patient
  const person =  patient.person  
  const fio = {...person.fio}  
  return (<>    
      <Card className="c-section p-mr-2 p-mb-2" header={header}>        
          <div className="p-fluid p-formgrid p-grid">
            <div className="p-field-checkbox p-col-12 p-lg-6">              
              <Checkbox inputId="notIdentified" checked={!identified} onChange={e =>{                
                certificateStore.identified = !e.checked                            
                }} />
              <label htmlFor="notIdentified">Умерший не идентифицирован</label>
            </div>
            <div className="p-field-checkbox p-col-12 p-lg-6">              
              <Checkbox inputId="fromRelatives" checked={fromRelatives} onChange={e => setFromRelatives(e.checked)} />
              <label htmlFor="fromRelatives">Внесено со слов родственников</label>
            </div>
            <div className="p-field p-d-flex p-flex-wrap p-jc-start">
              <div className='paragraph p-mr-1'> 1. </div>
              <div className='p-paragraph-field p-mr-2 p-mb-2' key={`pdiv1_${identified}`}>
                <NullFlavorWrapper 
                  disabled               
                  checked={identified} 
                  label={<label htmlFor="family">Фамилия</label>}
                  field={<InputText  id="family" value={person.fio.family} 
                  autoFocus type="text" disabled={!identified} 
                  onChange={(e)=>{                    
                    fio.family = e.target.value
                    person.fio = fio
                    certificateStore.checkFio()
                  }}/>}                  
                  options={NULL_FLAVORS.filter((item:IReference)=>"ASKU".includes(item.code))} 
                  value={ASKU}                                    
                />             
              </div>
              <div className="p-paragraph-field p-mr-2 p-mb-2" key={`pdiv2_${identified}`}>
                <NullFlavorWrapper                   
                  label={<label htmlFor="given_1">Имя</label>}
                  checked={identified}                   
                  field={
                    <InputText id="given_1" value={patient.person.fio.given_1} 
                    type="text" disabled={!identified}
                    onChange={(e)=>{
                      fio.given_1 = e.target.value
                      person.fio = fio                    
                      certificateStore.checkFio()                   
                  }}/>}
                  options={NULL_FLAVORS.filter((item:IReference)=>"ASKU".includes(item.code))}                   
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
                        disabled={!identified} 
                        onChange={(e)=>{ 
                          fio.given_2 = e.target.value                         
                          person.fio = fio                    
                          certificateStore.checkFio()}}
                      />
                    }
                    options={NULL_FLAVORS.filter((item:IReference)=>"ASKU NA".includes(item.code))} 
                    value={identified ? NA : ASKU}                                       
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
              <div className='p-paragraph-field'>                    
                <NullFlavorWrapper                     
                    label={<label htmlFor="dateBirth">Дата рождения</label>}
                    checked={true} setCheck={(e:CheckboxChangeParams, nullFlavors: INullFlavor[] | undefined)=>{                      
                      if (!e.checked) {                        
                        patient.birth_date = undefined
                        patient.birth_year = undefined 
                      } 
                      if (nullFlavors) patient.setNullFlavors(nullFlavors)    
                      certificateStore.checkBirthDay()
                    }} 
                    field={<div className="p-d-flex p-jc-start p-ai-center">              
                      <Calendar id="dateBirth" className="p-mr-2" 
                        view={yearBTChecked ? "month" : "date"} dateFormat={yearBTChecked ? "yy" : "dd/mm/yy"}                          
                        value={patient.birth_date} 
                        onChange={(e)=>certificateStore.setBirthDay(e.target.value as Date | undefined, yearBTChecked)                          
                        }
                        showIcon />
                      <div className="p-field-checkbox">              
                        <Checkbox checked={yearBTChecked} 
                          inputId="bd_year" 
                          onChange={e=>setYearBTChecked(e.checked)}/>
                        <label htmlFor="bd_year">Только год</label>
                      </div>
                    </div>}
                    options={NULL_FLAVORS.filter((item:IReference)=>"ASKU UNK".includes(item.code))} 
                    value={UNK}
                    field_name="birth_date"
                    nullFlavors={patient.nullFlavors()}
                />                               
              </div>              
            </div>
            <div className="p-field p-d-flex p-jc-center">
              <div className='paragraph p-mr-1'> 7. </div>
              <div className='p-paragraph-field p-mr-3 p-mb-2'>
                <NullFlavorWrapper                    
                  label={<label htmlFor="dateDeath">Дата смерти</label>}
                  checked={true} setCheck={(e:CheckboxChangeParams, nullFlavors: INullFlavor[] | undefined)=>{                      
                      if (!e.checked){                        
                        certificate.death_datetime = undefined
                        certificate.death_year = undefined 
                      } 
                      if (nullFlavors) certificate.setNullFlavors(nullFlavors)    
                      certificateStore.checkDeathDay()
                    }} 
                  field={<div className="p-d-flex p-jc-start p-ai-center">              
                      <Calendar id="dateDeath" className="p-mr-2" 
                        view={yearDTChecked ? "month" : "date"} dateFormat={yearDTChecked ? "yy" : "dd/mm/yy"} 
                        value={certificateStore.cert.death_datetime}
                        onChange={(e)=>certificateStore
                          .setDeathDay(e.target.value as Date | undefined, yearDTChecked) 
                        } 
                        showIcon />
                      <div className="p-field-checkbox">              
                        <Checkbox checked={yearDTChecked} 
                          inputId="bd_year" 
                          onChange={e=>setYearDTChecked(e.checked)}/>
                        <label htmlFor="bd_year">Только год</label>
                      </div>
                    </div>}
                    options={NULL_FLAVORS.filter((item:IReference)=>"ASKU UNK".includes(item.code))} 
                    value={UNK}
                    field_name="death_datetime"                    
                    nullFlavors={certificate.nullFlavors()}
                 />
              </div>     
              <div className='p-paragraph-field'>                
                <NullFlavorWrapper                    
                  label={<label htmlFor="timeDeath">Время смерти</label>}
                  checked={true}  
                  field={ <Calendar id="timeDeath"  
                    timeOnly hourFormat="24"             
                    value={certificate.death_datetime} 
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