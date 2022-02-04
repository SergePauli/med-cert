import { observer } from 'mobx-react-lite'
import React, { FC, useContext, useState } from 'react'
import { Context } from '../..'
import { InputText } from 'primereact/inputtext'
import { Card } from 'primereact/card'
import { CheckboxChangeParams } from 'primereact/checkbox'
import '../../styles/components/RadioButton.css'
import '../../styles/components/Calendar.css'
import '../../styles/pages/CertificatePage.css'
import NullFlavorWrapper from '../NullFlavorWrapper'
import { ASKU, ID_CARD_TYPES, NA, NULL_FLAVORS, PASSPORT_RF, UNK } from '../../utils/defaults'
import { IReference } from '../../models/IReference'
import { Calendar } from 'primereact/calendar'
import { checkFieldNullFlavor, INullFlavorR } from '../../models/INullFlavor'
import { Dropdown } from 'primereact/dropdown'
import { InputMask } from 'primereact/inputmask'
import { InputTextarea } from 'primereact/inputtextarea'
import Identity from '../../models/FormsData/Identity'
import IIdentity from '../../models/IIdentity'
import { inputsIdentity } from '../inputs/inputsIdentity'



 const Section2: FC = () => {
  const { certificateStore, suggestionsStore } = useContext(Context)   
  const identified = suggestionsStore.identified  
  const header = () => {
      return <span>Документы умершего</span>
    }    
  const certificate = certificateStore.cert   
  const patient = certificate.patient
  const identity = patient.identity 
  const [docChecked, setDocChecked] = useState(identified && patient.nullFlavors.findIndex(item=>!item._destroy && item.parent_attr==='identity')===-1)    
  const [dulValue, setDulValue]  = useState(ID_CARD_TYPES.find((item)=>item.code === identity?.identityCardType))
  const person =  patient.person   
  const nullFlavorOption =  docChecked ? "UNK" : "UNK ASKU NA" 
  const [seriesField, numberField, depCodeField] = inputsIdentity({dulValue, identity})    
  return (<>    
      <Card className="c-section p-mr-2 p-mb-2" header={header}>        
          <div className="p-fluid p-formgrid p-grid">            
            <div className="p-field p-d-flex p-flex-wrap p-jc-start">
              <div className='paragraph p-mr-1'>4. </div>
              <div className='p-paragraph-field p-mr-2 p-mb-2'>
                <NullFlavorWrapper 
                  disabled={!identified} paraNum                              
                  checked={docChecked} setCheck={(e:CheckboxChangeParams, nullFlavors: INullFlavorR[] | undefined)=>
                    { if (e.checked) {
                      patient.identity = new Identity({
                        identity_card_type_id: ID_CARD_TYPES[PASSPORT_RF].code,                                  
                          } as IIdentity)
                        if (!identified) suggestionsStore.identified = true
                      } else patient.identity = undefined 
                      if (nullFlavors) patient.nullFlavors = nullFlavors
                      setDocChecked(e.checked)
                    }}
                  nullFlavors={patient.nullFlavors}
                  field_name="identity"
                  label={<label htmlFor="identity_card_type">Документ, удостоверяющей личность умершего: </label>}
                  field={<Dropdown  id="identity_card_type" value={dulValue} 
                  autoFocus options={ID_CARD_TYPES} optionLabel='name'
                  onChange={(e)=>{
                    if (identity) identity.identityCardType = e.value.code
                    else {
                      patient.identity = new Identity({identity_card_type_id: e.value.code} as IIdentity)
                      checkFieldNullFlavor("identity", patient.identity, patient.nullFlavors)
                    }  
                    setDulValue(ID_CARD_TYPES.find((item)=>item.code === e.value.code))
                  }}
                  />}                  
                  options={NULL_FLAVORS.filter((item:IReference)=>nullFlavorOption.includes(item.code))} 
                  value={docChecked ? UNK : ASKU}                                    
                />             
              </div>
              <div className="p-paragraph-field p-mr-2 p-mb-2" key={`ser_${docChecked}`} 
                style={{marginLeft:'1.5rem'}}>
                <NullFlavorWrapper                   
                  label={<label htmlFor="series">Серия</label>}
                  checked={docChecked && patient.identity?.nullFlavors.findIndex(nf=>nf.parent_attr==='series')===-1} setCheck={(e:CheckboxChangeParams, nullFlavors: INullFlavorR[] | undefined)=>{
                    if (e.checked && patient.identity) patient.identity.series = ''
                    else if (patient.identity) patient.identity.series = undefined                                    
                  }}                 
                  field={seriesField}
                  field_name='series'
                  options={identified ? [NULL_FLAVORS[NA]] : [NULL_FLAVORS[ASKU]]}
                  value={NA}
                  nullFlavors={patient.identity?.nullFlavors}
                  lincked={!docChecked}                                   
                />  
              </div>
              <div className="p-paragraph-field p-mr-2 p-mb-2" key={`num_${docChecked}`}
                style={{marginLeft:'1.5rem'}} >
                <NullFlavorWrapper                   
                  label={<label htmlFor="docNumber">Номер</label>}
                  checked={docChecked}                 
                  field={numberField}
                  options={NULL_FLAVORS.filter((item:IReference)=>"ASKU UNK".includes(item.code))} 
                  value={identified ? UNK : ASKU} 
                  lincked                                      
                />                    
              </div>
              <div className="p-paragraph-field p-mr-3 p-mb-2" key={`org_${docChecked}`} style={{marginLeft:'1.5rem'}} >
                <NullFlavorWrapper                   
                  label={<label htmlFor="issueOrgName">Кем выдан</label>}
                  checked={docChecked}                   
                  field={
                    <InputTextarea id="issueOrgName" value={identity?.issueOrgName} 
                    cols={65} rows={2}   disabled={!identified}
                    onChange={(e)=>{if (identity) identity.issueOrgName = e.target.value }}/>}
                  options={NULL_FLAVORS.filter((item:IReference)=>"ASKU UNK".includes(item.code))} 
                  value={identified ? UNK : ASKU} 
                  lincked                                      
                />                    
              </div>
              <div className="p-paragraph-field p-mr-2 p-mb-2" style={{marginLeft:'1.5rem'}} key={`pdiv5_${docChecked}`}>
                <NullFlavorWrapper                   
                  label={<label htmlFor="issueDate">Когда выдан</label>}
                  checked={docChecked}                   
                  field={<Calendar  id="issueDate" className="p-mr-2" 
                    dateFormat={"dd.mm.yy"} 
                    locale="ru" mask="99.99.9999"                    
                    value={identity?.issueOrgDate}
                    onChange={(e)=>{if (identity) identity.issueOrgDate = e.target.value as Date | undefined}}
                    showIcon />
                  }
                  options={NULL_FLAVORS.filter((item:IReference)=>"ASKU UNK".includes(item.code))} 
                  value={identified ? UNK : ASKU}
                  field_name="issueDate"
                  lincked                                       
                /> 
              </div>  
              <div className="p-paragraph-field p-mr-2 p-mb-2" key={`code_${docChecked}`} style={{marginLeft:'1.5rem'}}> 
                <NullFlavorWrapper                   
                  label={<label htmlFor="depCode">Код подразделения</label>}
                  checked={docChecked && patient.identity?.nullFlavors.findIndex(nf=>nf.parent_attr==='issueOrgCode')===-1} 
                  setCheck={(e:CheckboxChangeParams, nullFlavors: INullFlavorR[] | undefined)=>{
                    if (e.checked && patient.identity) patient.identity.issueOrgCode = ''
                    else if (patient.identity) patient.identity.issueOrgCode = undefined  
                    if (nullFlavors && patient.identity) patient.identity.nullFlavors =  nullFlavors            
                  }}                   
                  field={depCodeField}
                  options={identified ? [NULL_FLAVORS[NA]] : [NULL_FLAVORS[ASKU]]}
                  value={identified ? NA : ASKU} 
                  nullFlavors={patient.identity?.nullFlavors} 
                  lincked={!docChecked}
                  field_name="issueOrgCode"                                     
                />                    
              </div>              
            </div>
            <div className="p-field p-d-flex p-jc-center">
              <div className='paragraph p-mr-1'> 5. </div>
              <div className='p-paragraph-field'>                    
                <NullFlavorWrapper paraNum                    
                    label={<label htmlFor="snils">СНИЛС</label>}
                    disabled={!identified} 
                    checked={person && person.nullFlavors.findIndex(item=>item.parent_attr === 'SNILS' && !item._destroy)===-1} setCheck={(e:CheckboxChangeParams, nullFlavors: INullFlavorR[] | undefined)=>{
                      if (!person) return
                      if (nullFlavors) person.nullFlavors = nullFlavors
                      if (!e.checked) person.SNILS = undefined                                       
                    }}                    
                    field={<InputMask id="snils"  
                      type="text" mask="999-999-999 99"
                      value={person?.SNILS} 
                      onChange={(e)=>{
                        if (!person) return
                        person.SNILS = e.target.value}}/>            
                    }
                    options={NULL_FLAVORS.filter((item:IReference)=>"ASKU UNK NA".includes(item.code))} 
                    value={docChecked ? UNK : ASKU}
                    field_name="SNILS"
                    nullFlavors={person?.nullFlavors}
                />                               
              </div>              
            </div>
            <div className="p-field p-d-flex p-jc-center">
              <div className='paragraph p-mr-1'>6.* </div>
              <div className='p-paragraph-field p-mr-3 p-mb-2'>
                <NullFlavorWrapper  paraNum                   
                    label={<label htmlFor="policyOMS">Серия и номер полиса ОМС</label>}
                    checked={identified && certificate.nullFlavors.findIndex(item=>item.parent_attr === 'policy_OMS' && !item._destroy)===-1} setCheck={(e:CheckboxChangeParams, nullFlavors: INullFlavorR[] | undefined)=>{
                      if (nullFlavors) certificate.nullFlavors = nullFlavors
                      if (!e.checked) certificate.policyOMS = undefined                                           
                    }}                     
                    field={<InputText id="policyOMS"  
                      type="text" 
                      value={certificate.policyOMS} 
                      onChange={(e)=>{certificate.policyOMS = e.target.value}}/>            
                    }
                    options={NULL_FLAVORS.filter((item:IReference)=>"ASKU UNK NA".includes(item.code))} 
                    value={docChecked ? UNK : ASKU}
                    field_name="policy_OMS"
                    nullFlavors={certificate.nullFlavors}
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
  export default observer(Section2) 