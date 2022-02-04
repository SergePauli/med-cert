import { observer } from "mobx-react-lite"
import { Button } from "primereact/button"
import { Calendar } from "primereact/calendar"
import { Card } from "primereact/card"
import { CheckboxChangeParams } from "primereact/checkbox"
import { Dropdown } from "primereact/dropdown"
import { InputMask } from "primereact/inputmask"
import { InputText } from "primereact/inputtext"
import { InputTextarea } from "primereact/inputtextarea"
import { FC, useContext, useEffect, useState } from "react"
import { Context } from "../.."
import Identity from "../../models/FormsData/Identity"
import Participant from "../../models/FormsData/Participant"
import IIdentity from "../../models/IIdentity"
import { IPersonName } from "../../models/IPersonName"
import { ID_CARD_TYPES, NA, NULL_FLAVORS, PARTIPICIPANT_DATE_SUG, PARTIPICIPANT_FIO_SUG, PARTIPICIPANT_IDENTITY_SUG, PASSPORT_RF } from "../../utils/defaults"
import { inputsIdentity } from "../inputs/inputsIdentity"
import { PersonName } from "../inputs/PersonName"
import NullFlavorWrapper from "../NullFlavorWrapper"

const Section10: FC = () => {
  const { certificateStore, suggestionsStore, layoutStore } = useContext(Context)
  const certificate = certificateStore.cert 
  const [participant] = useState(certificate.participant || new Participant())
  const person = participant.person 
  const identity = participant.identity
  const [docChecked, setDocChecked] = useState(!!participant.identity)
  const [dulValue, setDulValue]  = useState(ID_CARD_TYPES.find((item)=>item.code === identity?.identityCardType))
  const header = () => {
      return <span>Данные получателя свидетельства</span>
  }  
  useEffect(()=>{
    if (!!participant.person.fio?.family && !!participant.person.fio?.given_1) 
    suggestionsStore.suggestions[PARTIPICIPANT_FIO_SUG].done = true
  },[participant.person.fio?.family, participant.person.fio?.given_1, suggestionsStore.suggestions])
  useEffect(()=>{
    if (!!participant.receiptDate) 
    suggestionsStore.suggestions[PARTIPICIPANT_DATE_SUG].done = true
  },[participant.receiptDate, suggestionsStore.suggestions])
  useEffect(()=>{
    if (!!participant.person.SNILS || !!participant.identity) 
    suggestionsStore.suggestions[PARTIPICIPANT_IDENTITY_SUG].done = true
  },[participant.identity, participant.person.SNILS, suggestionsStore.suggestions])

  const [seriesField, numberField, depCodeField] = inputsIdentity({dulValue, identity})
  const buttonDisabled = !!certificate.participant || !(suggestionsStore.suggestions[PARTIPICIPANT_IDENTITY_SUG].done 
      && suggestionsStore.suggestions[PARTIPICIPANT_DATE_SUG].done
      && suggestionsStore.suggestions[PARTIPICIPANT_FIO_SUG].done)
  

  return (<>    
      <Card className="c-section p-mr-2 p-mb-2" header={header} style={{paddingLeft:'1rem'}}>        
          <div className="p-fluid p-formgrid p-grid">   
            <div className="p-field p-d-flex p-flex-wrap p-jc-start">              
              <div className='p-paragraph-field p-col-6'>
                <label htmlFor="fio">Фамилия, Имя, Отчество(при наличии)</label>
                <PersonName personName={participant.person?.fio} submitted={false}
                  onChange={(value: IPersonName)=>{                       
                    participant.person.fio  = value
                  }}  
                />                   
              </div>
              <div className='p-paragraph-field p-col-5'>
                <label htmlFor="description">Кем приходится</label>
                <InputText value={participant.description} 
                  placeholder="родств./пр-ль"
                  onChange={e=>participant.description = e.target.value}  
                />                   
              </div>
              <div className='p-paragraph-field p-col-6'>
                <label htmlFor="description">Дата выдачи</label>
                <Calendar id="dateBirth" showIcon dateFormat='dd.mm.yy'
                  locale='ru' mask='99.99.9999'                                          
                  value={participant.receiptDate} 
                  onChange={(e)=>{
                    if (e.target.value) participant.receiptDate = e.target.value as Date
                  }}                         
                />                   
              </div>
              <div className='p-paragraph-field p-col-4'> 
                <label htmlFor="snils">СНИЛС</label> 
                <InputMask id="snils"  
                  type="text" mask="999-999-999 99"
                  value={person?.SNILS} 
                  onChange={(e)=>{                     
                    person.SNILS = e.value
                  }}
                />                             
              </div>              
            </div>           
            <div className="p-field p-d-flex p-flex-wrap p-jc-start">              
              <div className='p-paragraph-field p-mr-2 p-mb-2'>
                <NullFlavorWrapper
                  checked={docChecked} setCheck={(e: CheckboxChangeParams) => {
                    if (e.checked) {
                      participant.identity = new Identity({
                      identity_card_type_id: ID_CARD_TYPES[PASSPORT_RF].code,
                    } as IIdentity)
                    } else participant.identity = undefined
                    setDocChecked(e.checked)
                    } 
                  }
                  label={<label htmlFor="identity_card_type">Иной документ, удостоверяющей личность: </label>}
                  field={<Dropdown id="identity_card_type" value={dulValue}
                    autoFocus options={ID_CARD_TYPES} optionLabel='name'
                    onChange={(e) => {
                      if (identity) identity.identityCardType = e.value.code
                      else participant.identity = new Identity({ identity_card_type_id: e.value.code } as IIdentity)
                      setDulValue(ID_CARD_TYPES.find((item) => item.code === e.value.code))
                    }} />
                  } 
                  options={[NULL_FLAVORS[NA]]}  value={NA}       
                />             
              </div>
              <div className="p-paragraph-field p-mr-2 p-mb-2" key={`ser_${docChecked}`} 
                style={{marginLeft:'1.5rem'}}>
                <NullFlavorWrapper                   
                  label={<label htmlFor="series">Серия</label>}
                  checked={docChecked && 
                    participant.identity?.nullFlavors.findIndex(nf=>nf.parent_attr==='series')===-1} 
                  setCheck={(e:CheckboxChangeParams)=>{
                    if (e.checked && participant.identity) participant.identity.series = ''
                    else if (participant.identity) participant.identity.series = undefined                                    
                  }}                 
                  field={seriesField}
                  field_name='series'
                  options={[NULL_FLAVORS[NA]]} value={NA}                  
                  lincked={!docChecked}                                   
                />  
              </div>
              <div className="p-paragraph-field p-mr-2 p-mb-2" key={`num_${docChecked}`}
                style={{marginLeft:'1.5rem'}} >
                <NullFlavorWrapper                   
                  label={<label htmlFor="docNumber">Номер</label>}
                  checked={docChecked}                 
                  field={numberField}
                  options={[NULL_FLAVORS[NA]]} value={NA} 
                  lincked                                      
                />                    
              </div>
              <div className="p-paragraph-field p-mr-3 p-mb-2" key={`org_${docChecked}`} style={{marginLeft:'1.5rem'}} >
                <NullFlavorWrapper                   
                  label={<label htmlFor="issueOrgName">Кем выдан</label>}
                  checked={docChecked}                   
                  field={
                    <InputTextarea id="issueOrgName" value={identity?.issueOrgName} 
                      cols={65} rows={2}  
                      onChange={(e)=>{if (identity) identity.issueOrgName = e.target.value }}
                    />}
                  options={[NULL_FLAVORS[NA]]} value={NA} 
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
                  options={[NULL_FLAVORS[NA]]} value={NA} 
                  lincked                                       
                /> 
              </div>  
              <div className="p-paragraph-field p-mr-2 p-mb-2" 
                key={`code_${docChecked}`} style={{marginLeft:'1.5rem'}}> 
                <NullFlavorWrapper                   
                  label={<label htmlFor="depCode">Код подразделения</label>}
                  checked={docChecked} 
                  setCheck={(e:CheckboxChangeParams)=>{
                    if (e.checked && participant.identity) participant.identity.issueOrgCode = ''
                    else if (participant.identity) participant.identity.issueOrgCode = undefined                                  
                  }}                   
                  field={depCodeField}
                  options={[NULL_FLAVORS[NA]]} value={NA}                   
                  lincked={!docChecked}
                  field_name="issueOrgCode"                                     
                />                    
              </div> 
              <Button type="button" label="ВЫДАТЬ" style={{height:'2.4rem'}}
                className="p-button-raised p-button-success"
                disabled={buttonDisabled}
                onClick={()=>{
                  certificate.participant = participant
                  certificate.issueDate = participant.receiptDate
                  layoutStore.message = { severity: 'success', summary: 'Успешно', detail: 'Данные получателя введены, сохраните изменения, после чего будет возможна печать.', life: 3000 }
                }}   
              />             
            </div>           
           </div>           
          </Card>
        </>)

}
export default observer(Section10)    