import { observer } from 'mobx-react-lite'
import React, { FC, useContext } from 'react'
import { Context } from '../..'
import { InputText } from 'primereact/inputtext'
import { Card } from 'primereact/card'
import { CheckboxChangeParams } from 'primereact/checkbox'
import '../../styles/components/RadioButton.css'
import '../../styles/components/Calendar.css'
import '../../styles/pages/CertificatePage.css'
import NullFlavorWrapper from '../NullFlavorWrapper'
import { ASKU, NA, NULL_FLAVORS, UNK } from '../../utils/defaults'
import { IReference } from '../../models/IReference'
import { Calendar } from 'primereact/calendar'
import { INullFlavor } from '../../models/INullFlavor'
import { Dropdown } from 'primereact/dropdown'
import { InputMask } from 'primereact/inputmask'
import { InputTextarea } from 'primereact/inputtextarea'


 const Section2: FC = () => {
   const { certificateStore } = useContext(Context)   
   const identified = certificateStore.identified

   
  
  const header = () => {
      return <span>Документы умершего</span>
    }
  const certificate = certificateStore.cert   
  const patient = certificate.patient
  const person =  patient.person     
  return (<>    
      <Card className="c-section p-mr-2 p-mb-2" header={header}>        
          <div className="p-fluid p-formgrid p-grid">            
            <div className="p-field p-d-flex p-flex-wrap p-jc-start">
              <div className='paragraph p-mr-1'> 4. </div>
              <div className='p-paragraph-field p-mr-2 p-mb-2' key={`pdiv1_${identified}`}>
                <NullFlavorWrapper 
                  disabled                                
                  checked={identified} 
                  label={<label htmlFor="identity_card_type">Документ, удостоверяющей личность умершего: </label>}
                  field={<Dropdown  id="identity_card_type" value={{code:"1",name:"Паспорт РФ"}} 
                  autoFocus options={[{code:"1",name:"Паспорт РФ"},{code:"5",name: "Временное удостоверение личности гражданина РФ (форма № 2П)"}]} optionLabel='name'
                  />}                  
                  options={NULL_FLAVORS.filter((item:IReference)=>"ASKU".includes(item.code))} 
                  value={ASKU}                                    
                />             
              </div>
              <div className="p-paragraph-field p-mr-2 p-mb-2" key={`pdiv2_${identified}`} 
                style={{marginLeft:'1.5rem'}}>
                <NullFlavorWrapper                   
                  label={<label htmlFor="series">Серия</label>}
                  checked={identified}                  
                  field={
                    <InputText id="series" value={''} 
                    type="text" disabled={!identified}
                    onChange={(e)=>{                                         
                  }}/>}
                  options={NULL_FLAVORS.filter((item:IReference)=>"ASKU NA".includes(item.code))}
                  value={identified ? NA : ASKU}                                   
                />  
              </div>
              <div className="p-paragraph-field p-mr-2 p-mb-2" style={{marginLeft:'1.5rem'}} key={`pdiv3_${identified}`}>
                <NullFlavorWrapper                   
                  label={<label htmlFor="docNumber">Номер</label>}
                  checked={identified}                 
                  field={
                    <InputText id="docNumber" value={''} 
                    type="text" disabled={!identified}
                    onChange={(e)=>{
                                         
                  }}/>}
                  options={NULL_FLAVORS.filter((item:IReference)=>"ASKU UNK".includes(item.code))} 
                  value={identified ? UNK : ASKU} 
                  lincked                                      
                />                    
              </div>
              <div className="p-paragraph-field p-mr-2 p-mb-2" style={{marginLeft:'1.5rem'}} key={`pdiv4_${identified}`}>
                <NullFlavorWrapper                   
                  label={<label htmlFor="issueOrgName">кем выдан</label>}
                  checked={identified}                   
                  field={
                    <InputTextarea id="issueOrgName" value={'ОВД ККЕККУК вавпп раона каааррп края'} 
                    cols={80} rows={2}   disabled={!identified}
                    onChange={(e)=>{
                                         
                  }}/>}
                  options={NULL_FLAVORS.filter((item:IReference)=>"ASKU UNK".includes(item.code))} 
                  value={identified ? UNK : ASKU} 
                  lincked                                      
                />                    
              </div>
              <div className="p-paragraph-field p-mr-2 p-mb-2" style={{marginLeft:'1.5rem'}} key={`pdiv5_${identified}`}>
                <NullFlavorWrapper                   
                  label={<label htmlFor="issueDate">когда</label>}
                  checked={identified}                   
                  field={<Calendar  id="issueDate" className="p-mr-2" 
                        dateFormat={"dd/mm/yy"}
                        onChange={(e)=>{}}
                        showIcon />
                    }
                  options={NULL_FLAVORS.filter((item:IReference)=>"ASKU UNK".includes(item.code))} 
                  value={identified ? UNK : ASKU}
                  lincked                                       
                /> 
              </div>  
              <div className="p-paragraph-field p-mr-2 p-mb-2" style={{marginLeft:'1.5rem'}} key={`pdiv6_${identified}`}>
                <NullFlavorWrapper                   
                  label={<label htmlFor="issueOrgCode">Код подразделения</label>}
                  checked={identified}                   
                  field={                    
                    <InputText id="issueOrgCode" value={'321-213'} 
                    type="text" disabled={!identified}
                    onChange={(e)=>{
                                         
                  }}/>}
                  options={NULL_FLAVORS.filter((item:IReference)=>"ASKU NA UNK".includes(item.code))} 
                  value={identified ? UNK : ASKU}                                       
                />                    
              </div>              
            </div>
            <div className="p-field p-d-flex p-jc-center">
              <div className='paragraph p-mr-1'> 5. </div>
              <div className='p-paragraph-field'>                    
                <NullFlavorWrapper                     
                    label={<label htmlFor="snils">СНИЛС</label>}
                    checked={identified} setCheck={(e:CheckboxChangeParams, nullFlavors: INullFlavor[] | undefined)=>{}} 
                    field={<InputMask id="snils"  
                      type="text" mask="999-999-999 99"
                      value={person.SNILS} 
                      onChange={(e)=>{}}/>            
                    }
                    options={NULL_FLAVORS.filter((item:IReference)=>"ASKU UNK NA".includes(item.code))} 
                    value={identified ? UNK : ASKU}
                    field_name="snils"
                    nullFlavors={person.nullFlavors()}
                />                               
              </div>              
            </div>
            <div className="p-field p-d-flex p-jc-center">
              <div className='paragraph p-mr-1'> 6. </div>
              <div className='p-paragraph-field p-mr-3 p-mb-2'>
                <NullFlavorWrapper                     
                    label={<label htmlFor="policyOMS">Серия и номер полиса ОМС</label>}
                    checked={identified} setCheck={(e:CheckboxChangeParams, nullFlavors: INullFlavor[] | undefined)=>{}} 
                    field={<InputText id="policyOMS"  
                      type="text" 
                      value={certificate.policyOMS} 
                      onChange={(e)=>{}}/>            
                    }
                    options={NULL_FLAVORS.filter((item:IReference)=>"ASKU UNK NA".includes(item.code))} 
                    value={identified ? UNK : ASKU}
                    field_name="policyOMS"
                    nullFlavors={certificate.nullFlavors()}
                />
              </div>     
            </div>            
          </div>          
      </Card>  
    </>)
  }
  export default observer(Section2) 