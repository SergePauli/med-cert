import { observer } from 'mobx-react-lite'
import { FC, useContext, useState } from 'react'
import { Context } from '../..'
import { Card } from 'primereact/card'
import { Checkbox, CheckboxChangeParams } from 'primereact/checkbox'
import { RadioButton } from 'primereact/radiobutton'
import '../../styles/components/RadioButton.css'
import '../../styles/components/Calendar.css'
import '../../styles/pages/CertificatePage.css'
import NullFlavorWrapper from '../NullFlavorWrapper'
import { ASKU, FEMALE, ID_CARD_TYPES, MALE, NOGENDER, NULL_FLAVORS, PASSPORT_RF, UNK } from '../../utils/defaults'
import { IReference } from '../../models/IReference'
import { Calendar } from 'primereact/calendar'
import { checkFieldNullFlavor, INullFlavorR } from '../../models/INullFlavor'
import { IPersonName } from '../../models/IPersonName'
import IIdentity from '../../models/IIdentity'
import Identity from '../../models/FormsData/Identity'
import Person from '../../models/FormsData/Person'
import { PersonName } from '../inputs/PersonName'


 const Section1: FC = () => {   
  const { certificateStore, suggestionsStore, layoutStore } = useContext(Context) 
  const certificate = certificateStore.cert   
  const patient = certificate.patient
  const person =  patient.person     
  const [yearBTChecked, setYearBTChecked] = useState<boolean>(!!patient.birth_year)   
  const [yearDTChecked, setYearDTChecked] = useState<boolean>(!!certificate.deathYear) 
  
  const header = () => {
      return <span>Данные умершего</span>
    }
    
  const identified = suggestionsStore.identified   
  const optionCode = suggestionsStore.fromRelatives ? 'ASKU' : 'NA UNK'
  const isDeathTime = certificate.deathDatetime!==undefined 
        && certificate.nullFlavors.findIndex((item)=>item.parent_attr==="death_time")===-1
  return (<>    
      <Card className="c-section p-mr-2 p-mb-2" header={header}>        
          <div className="p-fluid p-formgrid p-grid">
            <div className="p-field-checkbox p-col-12 p-lg-6">              
              <Checkbox inputId="notIdentified" checked={!suggestionsStore.identified} onChange={e =>{                
                if (e.checked) {
                  patient.person = undefined
                  patient.identity = undefined
                  certificate.policyOMS = undefined
                } else { 
                  patient.person = new Person()
                  if (yearBTChecked) { setYearBTChecked(false) 
                    patient.setBirthDay(patient.birth_date as Date | undefined, false)
                  }      
                }  
                checkFieldNullFlavor('person', patient.person, patient.nullFlavors, UNK) 
                checkFieldNullFlavor('identity', patient.identity, patient.nullFlavors, UNK)  
                checkFieldNullFlavor('policy_OMS', certificate.policyOMS, certificate.nullFlavors, UNK)           
                suggestionsStore.identified = !e.checked  
                }} 
              />
              <label htmlFor="notIdentified">Умерший не идентифицирован</label>
            </div>
            <div className="p-field-checkbox p-col-12 p-lg-6">              
              <Checkbox inputId="fromRelatives" checked={suggestionsStore.fromRelatives} 
              onChange={e =>{       
                suggestionsStore.fromRelatives = e.checked
                if (e.checked) { 
                  if (!patient.person) {
                    patient.person = new Person()
                    checkFieldNullFlavor('person', patient.person, patient.nullFlavors)
                  }  
                  if (yearBTChecked) { 
                    setYearBTChecked(false) 
                    patient.setBirthDay(patient.birth_date as Date | undefined, false)
                  }
                  patient.identity = undefined  
                  checkFieldNullFlavor('identity', patient.identity, patient.nullFlavors, ASKU)                                  
                } else 
                  patient.identity = new Identity({identity_card_type_id: ID_CARD_TYPES[PASSPORT_RF].code} as IIdentity)                
                }}/>
              <label htmlFor="fromRelatives">Внесено со слов родственников</label>
            </div>
            <div className="p-field p-d-flex p-flex-wrap p-jc-start">
              <div className='paragraph p-mr-1'> 1. </div>
              <div className='p-paragraph-field p-mr-2 p-mb-2' 
                key={`pdiv1_${identified}`} >
                <NullFlavorWrapper 
                  disabled={!suggestionsStore.fromRelatives}               
                  checked={identified} 
                  paraNum                                
                  label={<label htmlFor="family">Фамилия, имя, отчество(при наличии)</label>}
                  field={<PersonName personName={person?.fio}                                     
                    onChange={(value: IPersonName | undefined)=>{     
                      if (!person) return                          
                      if (value?.family !== "" && (!person.fio || person.fio.family ==="")) layoutStore.message = { severity: 'success', summary: 'Успешно', detail: 'ФИО умершего изменены, чтобы сохранить изменения, введите причину А в п.22', life: 3000 }                                        
                      person.fio = value || {family:'',given_1:''}
                      checkFieldNullFlavor('fio.given_2', person.fio.given_2, person.nullFlavors, UNK)     
                                                  
                  }}/>}                  
                  options={NULL_FLAVORS.filter((item:IReference)=>optionCode.includes(item.code))} 
                  value={suggestionsStore.fromRelatives ? ASKU : UNK} 
                  nullFlavors={patient.nullFlavors}  
                  field_name="person"                                 
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
                      }}/>
                    <label htmlFor='undef'> Неопределенный </label>
                  </div>
                  <div className='p-field-radiobutton'>                  
                    <RadioButton name='female' checked={patient.gender === FEMALE}
                      onChange={(e)=>{
                      if (e.checked) patient.gender = FEMALE  
                      else patient.gender = undefined
                      }}
                    />
                    <label htmlFor='female'> Женский</label>
                  </div>                
                  <div className='p-field-radiobutton'>                  
                    <RadioButton name='male' checked={patient.gender === MALE}
                      onChange={(e)=>{
                        if (e.checked) patient.gender = MALE  
                        else patient.gender = undefined
                      }}
                    />
                    <label htmlFor='male'>Мужской</label>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-field p-d-flex p-jc-center">
              <div className='paragraph p-mr-1'> 3. </div>
              <div className='p-paragraph-field' key={`pdiv5_${identified}`}>                    
                <NullFlavorWrapper paraNum
                    disabled={suggestionsStore.identified}                    
                    label={<label htmlFor="dateBirth">Дата рождения</label>}
                    checked={suggestionsStore.identified || yearBTChecked } setCheck={(e:CheckboxChangeParams, nullFlavors: INullFlavorR[] | undefined)=>{                      
                      if (!e.checked) {                        
                        patient.birth_date = undefined
                        patient.birth_year = undefined 
                      } 
                      if (nullFlavors) patient.nullFlavors = nullFlavors 
                    }} 
                    onChange={(e:IReference,  nullFlavors: INullFlavorR[] | undefined)=>{if (nullFlavors) patient.nullFlavors = nullFlavors}}
                    field={<div className="p-d-flex p-jc-start p-ai-center">              
                      <Calendar id="dateBirth" className="p-mr-2" locale="ru"
                        dateFormat={yearBTChecked ? "yy" : "dd.mm.yy"}  
                        view={yearBTChecked ? "year" : "date"} 
                        mask={yearBTChecked ? "9999" : "99.99.9999"}                         
                        value={patient.birth_date} 
                        onChange={(e)=>{
                          console.log('e',e)
                          patient.setBirthDay(e.target.value as Date | undefined, yearBTChecked)
                        }                          
                        }
                        showIcon />
                      <div className="p-field-checkbox">              
                        <Checkbox checked={yearBTChecked} 
                          inputId="bd_year" 
                          onChange={e=>{
                            setYearBTChecked(e.checked)
                            patient.setBirthDay(patient.birth_date as Date | undefined, e.checked) }}/>
                        <label htmlFor="bd_year">Только год</label>
                      </div>
                    </div>}
                    options={NULL_FLAVORS.filter((item:IReference)=>"ASKU UNK".includes(item.code))} 
                    value={suggestionsStore.fromRelatives ? ASKU : UNK}
                    field_name="birth_date"
                    nullFlavors={patient.nullFlavors}
                />                               
              </div>              
            </div>
            <div className="p-field p-d-flex p-jc-center">
              <div className='paragraph p-mr-1'> 7. </div>
              <div className='p-paragraph-field p-mr-3 p-mb-2'>
                <NullFlavorWrapper paraNum                   
                  label={<label htmlFor="dateDeath">Дата смерти</label>}                  
                  checked={certificate.deathDatetime!==undefined} setCheck={(e:CheckboxChangeParams, nullFlavors:      INullFlavorR[] | undefined)=>{                   
                    if (!e.checked) certificate.setDeathDay(undefined, false)                      
                    else certificate.setDeathDay(new Date(), false)                         
                    if (nullFlavors) certificate.nullFlavors = nullFlavors  
                  }} 
                  onChange={(e:IReference,  nullFlavors: INullFlavorR[] | undefined)=>{if (nullFlavors) certificate.nullFlavors = nullFlavors}}
                  field={<div className="p-d-flex p-jc-start p-ai-center">              
                      <Calendar id="dateDeath" className="p-mr-2" locale="ru"
                        dateFormat={yearDTChecked ? "yy" : "dd.mm.yy"} 
                        mask={yearDTChecked ? "9999" : "99.99.9999"}
                        view={yearDTChecked ? "year" : "date"}
                        value={certificate.deathDatetime}
                        onChange={(e)=>certificate.setDeathDay(e.target.value as Date | undefined, yearDTChecked) 
                        } 
                        showIcon />
                      <div className="p-field-checkbox">              
                        <Checkbox checked={yearDTChecked} 
                          inputId="bd_year" 
                          onChange={e=>{ setYearDTChecked(e.checked)
                            certificate.setDeathDay(certificate.deathDatetime as Date | undefined, e.checked)}}/>
                        <label htmlFor="bd_year">Только год</label>
                      </div>
                    </div>}
                    options={NULL_FLAVORS.filter((item:IReference)=>"ASKU UNK".includes(item.code))} 
                    value={UNK}
                    field_name="death_datetime"                    
                    nullFlavors={certificate.nullFlavors}
                 />
              </div>     
              <div className='p-paragraph-field' key={`pdivdt_${yearDTChecked}_${isDeathTime}`}>                
                <NullFlavorWrapper 
                  disabled={yearDTChecked}                   
                  label={<label htmlFor="timeDeath">Время смерти</label>}
                  checked={isDeathTime && !yearDTChecked} 
                  setCheck={(e:CheckboxChangeParams, nullFlavors: INullFlavorR[] | undefined)=>{                   
                    if (nullFlavors) certificate.nullFlavors = nullFlavors  
                  }}
                  onChange={(e:IReference,  nullFlavors: INullFlavorR[] | undefined)=>{if (nullFlavors) certificate.nullFlavors = nullFlavors}} 
                  field={ <Calendar id="timeDeath"  
                    timeOnly hourFormat="24" locale="ru"                                                   
                    value={certificate.deathDatetime} 
                    showIcon />}
                  options={NULL_FLAVORS.filter((item:IReference)=>"ASKU UNK".includes(item.code))} 
                  value={UNK}
                  field_name="death_time"
                  nullFlavors={certificate.nullFlavors}                  
                />
              </div>
            </div>            
          </div>          
      </Card>  
    </>)
  }
  export default observer(Section1) 