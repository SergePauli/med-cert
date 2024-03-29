import { observer } from 'mobx-react-lite'
import { FC, useContext, useEffect, useState } from 'react'
import { Context } from '../..'
import { Card } from 'primereact/card'
import '../../styles/components/Calendar.css'
import { DeathReason } from '../../models/FormsData/DeathReason'
import { IDeathReason } from '../../models/responses/IDeathReason'
import Reason from '../inputs/Reason'
import { Button } from 'primereact/button'
import { IMedicalServs } from '../../models/responses/IMedservs'
import DiagnosisService from '../../services/DiagnosisService'
import { AutoComplete } from 'primereact/autocomplete'
import { Procedure } from '../../models/FormsData/Procedure'
import { IProcedure } from '../../models/responses/IProcedure'
import { Calendar } from 'primereact/calendar'
import { Checkbox } from 'primereact/checkbox'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { EXT_REASON_SUG, EXT_REASON_TIME_SUG } from '../../utils/defaults'
import { InputText } from 'primereact/inputtext'



 const Section8: FC = () => {
  const { certificateStore, temporaryIDStore, suggestionsStore } = useContext(Context) 
  const checkReason = suggestionsStore.suggestions[EXT_REASON_SUG].done && suggestionsStore.suggestions[EXT_REASON_TIME_SUG].done
  
  
  const certificate = certificateStore.cert   
  const [newReason, setNewReason] = useState(new DeathReason({id: temporaryIDStore.lastDeathReasonID} as IDeathReason))
  const [medicalServs, setMedicalServs] = useState<IMedicalServs[]>([]) 
  const [medservText, setMedservText] = useState('')  
  const [medservCode, setMedservCode] = useState('')
  const [procedure, setProcedure] = useState<Procedure | null>(null)  
  const [dateETChecked, setDateETChecked] = useState(false)
  const [diagnosChecked, setDiagnosChecked] = useState(true)
  const [selectedProcedures, setSelectedProcedures] = useState<Procedure[]>([])
  const [selectedReasons, setSelectedReasons] = useState<DeathReason[]>([])
  useEffect(()=>{
    suggestionsStore.suggestions[EXT_REASON_SUG].done = !(newReason.diagnosis === undefined && (newReason.nullFlavors.length===0 || newReason.nullFlavors.findIndex((item)=>item.parent_attr==='diagnosis')===-1))
    suggestionsStore.suggestions[EXT_REASON_TIME_SUG].done = !(newReason.effectiveTime === undefined && newReason.nullFlavors.findIndex((item)=>item.parent_attr==='effective_time')===-1)
  },[newReason.diagnosis, newReason.effectiveTime, suggestionsStore.suggestions, newReason.nullFlavors]) 
  const header = () => {
      return <><span><span className='paragraph p-mr-1'>22(II).</span>Прочие состояния.</span> 
      <Button icon="pi pi-plus" className="p-ml-auto p-mr-2 p-button-sm p-button-raised p-button-success" label="Добавить состояние" 
        disabled={!checkReason || (!newReason.diagnosis && newReason.procedures.length===0) || procedure!==null }
        onClick={()=>{
          if (!certificate.deathReasons.includes(newReason)) certificate.deathReasons.push(newReason)
          setNewReason(new DeathReason({id: temporaryIDStore.lastDeathReasonID} as IDeathReason))                
        }}
      />
      <Button icon="pi pi-minus" className="p-button-sm p-button-raised p-button-danger"  
        title="Удалить состояние" disabled={selectedReasons.length===0} 
        onClick={()=>{
          let _reasons = certificate.deathReasons?.filter(val => !selectedReasons.includes(val));
          certificate.deathReasons = _reasons
          setSelectedReasons([])
        }} />
      </>
    }
    
  const  getMedservs = (event: { query: string })=>{
  const option = {} as any
  if (event.query.trim().length>0) option.name_cont = event.query.trim()
  if (medservCode.trim().length>0) option.s_code_start =  medservCode    
  DiagnosisService.fetchMedicalServs(option).then(response=>{
        if (response.data.length>0) setMedicalServs(response.data)
        else setMedicalServs([])        
      }).catch((reason)=>console.log(reason))    
  }
  const  getCodes = (event: { query: string })=>{    
    if (event.query.trim().length>0) {
      DiagnosisService.fetchMedicalServs({'s_code_start': event.query.trim()}).then(response=>{        
        if (response.data.length>0) setMedicalServs(response.data)
        else setMedicalServs([])        
      }).catch((reason)=>console.log(reason))       
    } 
  }

  const setMedServValue = (e:any)=>{
    if (procedure) procedure.medicalServ = e.value
    else  setProcedure(new Procedure({id: temporaryIDStore.lastProcedureID, medical_serv: e.value} as IProcedure))    
    setMedservText(e.value.name)
    setMedservCode(e.value.s_code)              
  } 
  const medServOptionTemplate = (option: IMedicalServs) => {
        return (
          <span>
            <span style={{marginRight:'4px'}}>{option.s_code}</span>
            <span>{option.name}</span>
          </span>
        )
    }

  const mainCSSClass = (isACME: boolean) => isACME  ? "p-fluid p-d-flex p-jc-start ACME-reason" : "p-fluid p-d-flex p-jc-start"
  
  const procTimeBodyTemplate = (rowData: Procedure) => {
    return rowData.timeStr()
  }
  const reasonTimeBodyTemplate = (rowData: DeathReason) => {
    let _resultStr = ''
    if (rowData.effectiveTime === undefined) return _resultStr
    if (rowData.years && rowData.years > 0) _resultStr += `лет:${rowData.years} `
    if (rowData.months && rowData.months > 0) _resultStr += `мес: ${rowData.months}`
    if (rowData.weeks && rowData.weeks > 0) _resultStr += `нед: ${rowData.weeks}`
    if (rowData.days && rowData.days > 0) _resultStr += `дн: ${rowData.days}`
    if (rowData.hours && rowData.hours > 0) _resultStr += `час: ${rowData.hours}`
    if (rowData.minutes && rowData.minutes > 0) _resultStr += `мин: ${rowData.minutes}`
    return _resultStr
  }
  
  const reasonTextBodyTemplate = (rowData: DeathReason) => {
    let _resultStr = ''
    if (rowData.diagnosis) _resultStr = rowData.diagnosis.s_name+';'
    if (rowData.procedures.length>0) _resultStr += rowData.procNames()
    return _resultStr
  }  
  return (<>    
    <Card className="c-section p-mr-2 p-mb-2" header={header}>
      <div className={mainCSSClass(false)}
       style={{width: '98%'}} key={`ra_${newReason.id}_${diagnosChecked}`}>      
        <div className='paragraph p-mr-1'>*)</div>
        <Reason label="способствовавшие смерти, но не связанные с болезнью или патологическим состоянием, приведшим к ней" 
          deathReason={newReason} certificate={certificate}
          key={`ra2_${newReason.effectiveTime}`}           
          onChange={(reason: DeathReason | undefined)=>{  
            if (reason) {              
              if (reason!==newReason) {
                if (!reason.id) reason.id = temporaryIDStore.lastDeathReasonID
                setNewReason(reason)
              }  
            }           
          }}
          onDiagnosisChecked={(checked)=>setDiagnosChecked(checked)}
          checked={diagnosChecked}                                   
        />                   
      </div>
      <div className='p-fluid p-formgrid p-grid p-add-block' style={{marginLeft:'1rem'}}>   
          <div className='p-field p-col-12 p-md-9'>             
            <AutoComplete id="procedure_text" placeholder="Наименование хирургической операции"
              suggestions={medicalServs} delay={1000} dropdown 
              completeMethod={getMedservs} itemTemplate={medServOptionTemplate}
              field="name" onChange={(e) =>{ 
                if (e.value.s_code) setMedServValue(e)
                else setMedservText(e.value)
              }}
              value={medservText}/>          
          </div>
          <div className="p-field p-col-12 p-md-3">
            <AutoComplete id="procedure_code" placeholder="Код"
              suggestions={medicalServs} delay={1000} field="s_code"
              itemTemplate={medServOptionTemplate}
              completeMethod={getCodes} onChange={(e) =>{ 
                 if (e.value.s_code) setMedServValue(e)
                 else setMedservCode(e.value)               
              }}
              value={medservCode}/>          
          </div>  
          <div className="p-field p-col-12">
            <InputText id="procedure_alterText" disabled={!procedure}
            placeholder="Свое наименование, если оно отличается от официального"
               onChange={e =>{ 
                if (procedure) procedure.textValue = e.target.value               
              }}
              value={procedure?.textValue || ''}/>          
          </div>       
          <div className="p-field p-col-12  p-d-flex p-ai-center">                          
            <Calendar id="effectiveDate" key={`effectiveDate${dateETChecked}`} className="p-mr-3" inputStyle={{width:'12.5rem'}} 
              showTime={!dateETChecked} dateFormat="dd.mm.yy" locale="ru"
              mask={dateETChecked ? '99.99.9999' : '99.99.9999 99:99'} panelStyle={{margin:'10rem'}}                           
              value={procedure?.effectiveTime} 
              onChange={(e)=>{ 
                if (procedure===null) return 
                if (e.target.value) {                  
                  procedure.effectiveTime = e.target.value as Date
                } else procedure.effectiveTime =  undefined               
               }}
              showIcon 
            />            
            <div className="p-field-checkbox">              
              <Checkbox checked={dateETChecked} 
                inputId="et_date" 
                onChange={e=>{setDateETChecked(e.checked)}}
              />
              <label htmlFor="et_date">Только дата</label>
            </div>                       
            <Button icon="pi pi-plus" className="p-ml-auto p-mr-2 p-button-sm p-button-raised p-button-success"  title="Добавить хир.операцию" disabled={procedure===null || (procedure.medicalServ===undefined && procedure.textValue === undefined)} onClick={()=>{
              if (procedure) { 
                if (newReason.procedures.findIndex(pr=>pr.guid === procedure.guid)===-1) newReason.procedures.push(procedure)
                setProcedure(null) 
                setMedservCode('')
                setMedservText('')               
              }  
            }} />   
            <Button icon="pi pi-minus" className="p-button-sm p-button-raised p-button-danger"  title="Удалить  хир.операцию" disabled={selectedProcedures.length===0} onClick={()=>{
              let _procedures = newReason.procedures.filter(val => !selectedProcedures.includes(val));
              newReason.procedures = _procedures
              setSelectedProcedures([])
            }} />                    
          </div>
          <div className="p-field p-col-12">
            <DataTable value={newReason.procedures} selection={selectedProcedures}
              responsiveLayout="scroll" dataKey={"id"}
              className="p-datatable-sm" emptyMessage="Операции отсутствуют" style={{width:'100%'}} 
              onSelectionChange={e =>{
                setSelectedProcedures(e.value)                
                if (e.value && e.value.length>0) {
                  const pr = e.value[0] as Procedure
                  setProcedure(pr)
                  setDateETChecked(pr.effectiveTime?.getHours() === 0 && pr.effectiveTime.getMinutes()=== 0)
                  setMedservCode(pr.medicalServ.s_code)
                  setMedservText(pr.medicalServ.name)
                } else {
                  setProcedure(null) 
                  setMedservCode('')
                  setMedservText('') 
                }
              }}  >
              <Column selectionMode="multiple" headerStyle={{width: '3em'}}></Column>
              <Column field="medicalServ.name" header="Наименование"></Column>
              <Column header="Время" body={procTimeBodyTemplate}></Column>                            
            </DataTable>
          </div>  
        </div> 
        <DataTable value={certificate.deathReasons} style={{marginTop:'8px', marginLeft:'10px'}} 
          className="p-datatable-sm" emptyMessage="Состояния отсутствуют" selection={selectedReasons}  
          responsiveLayout="scroll" dataKey={"id"} onSelectionChange={e=>{            
            setSelectedReasons(e.value)            
            if (e.value && e.value.length>0) setNewReason(e.value[0])
            else {
              setNewReason(new DeathReason({id: temporaryIDStore.lastDeathReasonID} as IDeathReason)) 
            }
          }}>
          <Column selectionMode="multiple" headerStyle={{width: '3em'}}></Column>
          <Column header="Состояние" body={reasonTextBodyTemplate}></Column>
          <Column header="Период времени" body={reasonTimeBodyTemplate}></Column>
          <Column field="diagnosis.ICD10" header="Kод МКБ10"></Column>              
        </DataTable>            
    </Card>  
  </>)
  }
  export default observer(Section8) 