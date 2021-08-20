import { observer } from 'mobx-react-lite'
import React, { FC, useContext, useState } from 'react'
import { Context } from '../..'
import { InputText } from 'primereact/inputtext'
import { Card } from 'primereact/card'
import { Checkbox } from 'primereact/checkbox'
import { RadioButton } from 'primereact/radiobutton'
import '../../styles/components/RadioButton.css'
import '../../styles/components/Calendar.css'
import '../../styles/pages/CertificatePage.css'
import NullFlavorWrapper from '../NullFlavorWrapper'
import { NA, NULL_FLAVORS, UNK } from '../../utils/defaults'
import { IReference } from '../../models/IReference'
import { Calendar } from 'primereact/calendar'

 const Section1: FC = () => {
   const { certificateStore } = useContext(Context)   
   const [notIdentified, setNotIdentified] = useState<boolean>(false)
   const [fromRelatives, setFromRelatives] = useState<boolean>(false)
   const [fioChecked, setFIOChecked] = useState<boolean>(true)
   const [bTimeChecked, setBTimeChecked] = useState<boolean>(true)  
   const [yearBTChecked, setYearBTChecked] = useState<boolean>(false)
   const [dDateChecked, setDDateChecked] = useState<boolean>(true) 
   const [yearDTChecked, setYearDTChecked] = useState<boolean>(false) 
   const [dTimeChecked, setDTimeChecked] = useState<boolean>(true)  
   
   const year = (new Date()).getFullYear().toString()
   
   const header = () => {
      return <span>Данные умершего</span>
    }
  return (<>    
      <Card className="c-section p-mr-2 p-mb-2" header={header}>        
          <div className="p-fluid p-formgrid p-grid">
            <div className="p-field-checkbox p-col-12 p-lg-6">              
              <Checkbox inputId="notIdentified" checked={notIdentified} onChange={e =>setNotIdentified(e.checked)} />
              <label htmlFor="notIdentified">Умерший не идентифицирован</label>
            </div>
            <div className="p-field-checkbox p-col-12 p-lg-6">              
              <Checkbox inputId="fromRelatives" checked={fromRelatives} onChange={e => setFromRelatives(e.checked)} />
              <label htmlFor="fromRelatives">Внесено со слов родственников</label>
            </div>
            <div className="p-field p-d-flex p-jc-center">
              <div className='paragraph p-mr-1'> 1. </div>
              <div className='p-grid paragraph'>
                <div className="p-field p-col-12 p-lg-6">
                  <label htmlFor="family">Фамилия</label>
                  <InputText  id="family" autoFocus type="text" disabled={notIdentified} />
                </div>
                <div className="p-field p-col-12 p-lg-6">
                  <label htmlFor="given_1">Имя</label>
                  <InputText id="given_1" type="text" disabled={notIdentified} />
                </div>
                <div className="noParagraph p-col-12">
                  <NullFlavorWrapper 
                    disabled={notIdentified}
                    label={<label htmlFor="given_2">Отчество</label>}
                    checked={fioChecked} setCheck={setFIOChecked} 
                    field={               
                      <InputText id="given_2" type="text"  disabled={notIdentified} />
                    }
                    options={NULL_FLAVORS.filter((item:IReference)=>"ASKU NA".includes(item.code))} 
                    value={NULL_FLAVORS[NA]}
                    setValue={()=>{}}
                  />
                </div>
              </div>              
            </div>
            <div className="p-d-flex p-jc-center">
              <div className='paragraph p-mr-1' style={{marginTop: '0.1rem'}}> 2. </div>
              <div className='p-grid paragraph'>
                <div className="p-col-12 p-formgroup-inline">
                  <div className='p-field-radiobutton p-radiobutton'>Пол</div>
                  <div className='p-field-radiobutton'>                  
                    <RadioButton name='undef'/>
                    <label htmlFor='undef'> Неопределенный </label>
                  </div>
                  <div className='p-field-radiobutton'>                  
                    <RadioButton name='female'/>
                    <label htmlFor='female'> Женский</label>
                  </div>                
                  <div className='p-field-radiobutton'>                  
                    <RadioButton name='male'/>
                    <label htmlFor='male'>Мужской</label>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-d-flex p-jc-center">
              <div className='paragraph p-mr-1' style={{marginTop: '0.1rem'}}> 3. </div>
              <div className='p-grid paragraph'>                    
                <div className="p-col-12 p-paragraph-field">
                  <NullFlavorWrapper                    
                    label={<label htmlFor="dateBirth">Дата рождения</label>}
                    checked={bTimeChecked} setCheck={setBTimeChecked} 
                    field={<div className="p-grid">              
                      <Calendar id="dateBirth" className="p-col-12 p-lg-5" 
                        view={yearBTChecked ? "month" : "date"} dateFormat={yearBTChecked ? "yy" : "dd/mm/yy"} yearNavigator={yearBTChecked} yearRange={`1910:${year}`}                         
                        value={certificateStore.eff_time()} 
                        showIcon />
                      <div className="p-field-checkbox p-col-12 p-lg-4">              
                        <Checkbox checked={yearBTChecked} 
                          inputId="bd_year" 
                          onChange={e=>setYearBTChecked(e.checked)}/>
                        <label htmlFor="bd_year">Только год</label>
                      </div>
                    </div>
                    }
                    options={NULL_FLAVORS.filter((item:IReference)=>"ASKU UNK".includes(item.code))} 
                    value={NULL_FLAVORS[UNK]}
                    setValue={()=>{}}
                  />
                </div>                
              </div>
            </div>
            <div className="p-d-flex p-jc-center">
              <div className='paragraph p-mr-1' style={{marginTop: '0.1rem'}}> 4. </div>
              <div className='p-grid paragraph'>                    
                <div className="p-col-12 p-paragraph-field">
                  <NullFlavorWrapper                    
                    label={<label htmlFor="dateDeath">Дата смерти</label>}
                    checked={dDateChecked} setCheck={setDDateChecked} 
                    field={<div className="p-grid">              
                      <Calendar id="dateDeath" className="p-col-12 p-lg-4" 
                        view={yearDTChecked ? "month" : "date"} dateFormat={yearDTChecked ? "yy" : "dd/mm/yy"} yearNavigator={yearDTChecked}             
                        value={certificateStore.eff_time()} 
                        showIcon />
                      <div className="p-field-checkbox p-col-12 p-lg-4">              
                        <Checkbox checked={yearDTChecked} 
                          inputId="bd_year" 
                          onChange={e=>setYearDTChecked(e.checked)}/>
                        <label htmlFor="bd_year">Только год</label>
                      </div>
                    </div>
                    }
                    options={NULL_FLAVORS.filter((item:IReference)=>"ASKU UNK".includes(item.code))} 
                    value={NULL_FLAVORS[UNK]}
                    setValue={()=>{}}
                  />
                </div> 
                <div className="p-col-12 p-lg-5">
                  <NullFlavorWrapper                    
                    label={<label htmlFor="timeDeath">Время смерти</label>}
                    checked={dTimeChecked} setCheck={setDTimeChecked} 
                    field={              
                      <Calendar id="timeDeath"  
                        timeOnly hourFormat="24"             
                        value={certificateStore.eff_time()} 
                        showIcon />
                    }
                    options={NULL_FLAVORS.filter((item:IReference)=>"ASKU UNK".includes(item.code))} 
                    value={NULL_FLAVORS[UNK]}
                    setValue={()=>{}}
                  />
                </div>       
              </div>
            </div>            
          </div>          
      </Card>  
    </>)
  }
  export default observer(Section1) 