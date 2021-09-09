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
import { ASKU, ID_CARD_TYPES, NA, NULL_FLAVORS, PASSPORT_RF, UNK } from '../../utils/defaults'
import { IReference } from '../../models/IReference'
import { Calendar } from 'primereact/calendar'
import { INullFlavor } from '../../models/INullFlavor'
import { Dropdown } from 'primereact/dropdown'
import { InputMask, InputMaskProps } from 'primereact/inputmask'
import { InputTextarea } from 'primereact/inputtextarea'
import Identity from '../../models/FormsData/Identity'
import IIdentity from '../../models/IIdentity'


 const Section2: FC = () => {
  const { certificateStore } = useContext(Context)   
  const identified = certificateStore.identified  
  const header = () => {
      return <span>Документы умершего</span>
    }
  const certificate = certificateStore.cert   
  const patient = certificate.patient
  const identity = patient.identity 
  const docChecked = identified && identity!==undefined  
  const dul_value = ID_CARD_TYPES.find((item)=>item.code === identity?.identityCardType)
  const person =  patient.person   
  const seriesProps = {type:"text", id:"series", value:identity?.series,                  
      onChange:(e:any)=>{if (identity) certificateStore.setIDSeries(e.target.value) }}  
  const seriesField = dul_value?.s_mask ? <InputMask {...{mask:dul_value?.s_mask,...seriesProps} as InputMaskProps }/>
    : <InputText {...seriesProps}/>   
  const numberProps = {type:"text", id:"docNumber", value:identity?.number,                  
      onChange:(e:any)=>{if (identity) certificateStore.setIDNumber(e.target.value) }}  
  const numberField = dul_value?.n_mask ? <InputMask {...{mask:dul_value?.n_mask,...numberProps} as InputMaskProps }/>
    : <InputText {...numberProps}/> 
  const depCodeProps = {type:"text", id:"depCode", value:identity?.issueOrgCode,                  
      onChange:(e:any)=>{if (identity) certificateStore.setIORGCODE(e.target.value)}}  
  const depCodeField = dul_value?.c_mask ? <InputMask {...{mask:dul_value?.c_mask,...depCodeProps} as InputMaskProps }/>
    : <InputText {...depCodeProps}/>    
  return (<>    
      <Card className="c-section p-mr-2 p-mb-2" header={header}>        
          <div className="p-fluid p-formgrid p-grid">            
            <div className="p-field p-d-flex p-flex-wrap p-jc-start">
              <div className='paragraph p-mr-1'> 4. </div>
              <div className='p-paragraph-field p-mr-2 p-mb-2' key={`pdiv1_${docChecked}`}>
                <NullFlavorWrapper 
                  disabled={!identified}                                
                  checked={docChecked} setCheck={(e:CheckboxChangeParams, nullFlavors: INullFlavor[] | undefined)=>
                    { if (e.checked) patient.identity = new Identity({
                        identityCardType: ID_CARD_TYPES[PASSPORT_RF].code,          
                      } as IIdentity)
                      else patient.identity = undefined 
                      if (nullFlavors) patient.setNullFlavors(nullFlavors)    
                      certificateStore.checkIdentity()
                    }}
                  nullFlavors={patient.nullFlavors()}
                  field_name="identity"
                  label={<label htmlFor="identity_card_type">Документ, удостоверяющей личность умершего: </label>}
                  field={<Dropdown  id="identity_card_type" value={dul_value} 
                  autoFocus options={ID_CARD_TYPES} optionLabel='name'
                  onChange={(e)=>{if (identity) identity.identityCardType = e.value.code}}
                  />}                  
                  options={NULL_FLAVORS.filter((item:IReference)=>"ASKU".includes(item.code))} 
                  value={ASKU}                                    
                />             
              </div>
              <div className="p-paragraph-field p-mr-2 p-mb-2" key={`pdiv2_${docChecked}_${dul_value?.s_mask}`} 
                style={{marginLeft:'1.5rem'}}>
                <NullFlavorWrapper                   
                  label={<label htmlFor="series">Серия</label>}
                  checked={docChecked}                  
                  field={seriesField}
                  options={identified ? [NULL_FLAVORS[NA]] : [NULL_FLAVORS[ASKU]]}
                  value={docChecked ? NA : ASKU}
                  lincked={!docChecked}                                   
                />  
              </div>
              <div className="p-paragraph-field p-mr-2 p-mb-2" 
                style={{marginLeft:'1.5rem'}} key={`pdiv3_${docChecked}`}>
                <NullFlavorWrapper                   
                  label={<label htmlFor="docNumber">Номер</label>}
                  checked={docChecked}                 
                  field={numberField}
                  options={NULL_FLAVORS.filter((item:IReference)=>"ASKU UNK".includes(item.code))} 
                  value={identified ? UNK : ASKU} 
                  lincked                                      
                />                    
              </div>
              <div className="p-paragraph-field p-mr-2 p-mb-2" style={{marginLeft:'1.5rem'}} key={`pdiv4_${docChecked}`}>
                <NullFlavorWrapper                   
                  label={<label htmlFor="issueOrgName">Кем выдан</label>}
                  checked={docChecked}                   
                  field={
                    <InputTextarea id="issueOrgName" value={identity?.issueOrgName} 
                    cols={70} rows={2}   disabled={!identified}
                    onChange={(e)=>{if (identity) certificateStore.setIORGNAME(e.target.value) }}/>}
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
                    dateFormat={"dd/mm/yy"} value={identity?.issueOrgDate}
                    onChange={(e)=>{if (identity) certificateStore.setIORGDate(e.target.value as Date | undefined)}}
                    showIcon />
                  }
                  options={NULL_FLAVORS.filter((item:IReference)=>"ASKU UNK".includes(item.code))} 
                  value={identified ? UNK : ASKU}
                  lincked                                       
                /> 
              </div>  
              <div className="p-paragraph-field p-mr-2 p-mb-2" style={{marginLeft:'1.5rem'}} 
              key={`pdiv6_${docChecked}`}>
                <NullFlavorWrapper                   
                  label={<label htmlFor="depCode">Код подразделения</label>}
                  checked={docChecked}                   
                  field={depCodeField}
                  options={identified ? [NULL_FLAVORS[NA]] : [NULL_FLAVORS[ASKU]]}
                  value={identified ? NA : ASKU}  
                  lincked={!docChecked}                                     
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
                      onChange={(e)=>{certificateStore.setSNILS(e.target.value)}}/>            
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
                      onChange={(e)=>{certificateStore.setPolicyOMS(e.target.value)}}/>            
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