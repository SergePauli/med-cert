import { observer } from 'mobx-react-lite'
import { FC, useContext} from 'react'
import { Context } from '../..'
import { Card } from 'primereact/card'
import { CheckboxChangeParams } from 'primereact/checkbox'
import '../../styles/components/RadioButton.css'
import '../../styles/components/Calendar.css'
import '../../styles/pages/CertificatePage.css'
import NullFlavorWrapper from '../NullFlavorWrapper'
import { NA, NULL_FLAVORS } from '../../utils/defaults'
import { IReference } from '../../models/IReference'
import { Dropdown } from 'primereact/dropdown'

import { INullFlavorR } from '../../models/INullFlavor'
import { DEATH_KINDS, DISEASE_DEADTH_KIND } from '../../NSI/1.2.643.5.1.13.13.99.2.21'
import { Calendar } from 'primereact/calendar'
import { InputTextarea } from 'primereact/inputtextarea'
import { MEDICS } from '../../NSI/1.2.643.5.1.13.13.99.2.22'
import { BASIS_DERMINING } from '../../NSI/1.2.643.5.1.13.13.99.2.23'

 const Section6: FC = () => {
  const { certificateStore } = useContext(Context)
   
  const optionCode = 'NA'
  const options = NULL_FLAVORS.filter((item:IReference)=>optionCode.includes(item.code))  
  
  const header = () => {
      return <span>Характеристика причины смерти</span>
    }
  const certificate = certificateStore.cert  
  const isExtReason = certificate.deathKind !== undefined && certificate.deathKind !== DISEASE_DEADTH_KIND 
  
  
  
  const ddStyle = {minWidth:'210px', maxWidth:'500px', marginTop: '0.5rem', marginLeft: '-0.75rem'}
  const dDivStyle = {paddingTop: '0.1rem'}
      
  return (<>    
      <Card className="c-section p-mr-2 p-mb-2" header={header}>        
          <div className="p-fluid p-formgrid p-grid">            
            <div className="p-field p-d-flex p-flex-wrap p-jc-start">
              <div className='paragraph p-mr-1'>18. </div>
              <div className="p-paragraph-field p-mr-2 p-mb-2" style={dDivStyle}>
                <label htmlFor="deathPlaceType">Смерть произошла</label>
                <Dropdown inputId="deathPlaceType" style={ddStyle} placeholder="Выбрать"  
                  options={DEATH_KINDS} optionLabel="name" autoFocus
                  value={DEATH_KINDS.find((item)=>item.code === certificate.deathKind)} 
                  onChange={(e) =>{
                    certificate.deathKind = e.value.code                    
                  }} />
              </div>  
            </div>            
            <div className="p-field p-d-flex p-flex-wrap p-jc-start" style={{width: '98%'}} >
              <div className='paragraph p-mr-1'>19.</div>
              <div className="p-paragraph-field p-mr-2 p-mb-2" key={`pdivdt_${isExtReason}`} style={{width: '90%'}}>                                  
                <NullFlavorWrapper paraNum disabled checked={isExtReason}                                      
                  label={<label htmlFor="extReasonTime"> В случае смерти от несчастного случая, убийства, самоубийства, от военных и террористических действий, при неустановленном роде смерти - указать дату, время и обстоятельства травмы (отравления)</label>}
                  setCheck={(e:CheckboxChangeParams, nullFlavors: INullFlavorR[] | undefined)=>{                      
                      if (!e.checked) {                        
                        certificate.extReasonTime = undefined                        
                      } 
                      if (nullFlavors) certificate.nullFlavors = nullFlavors
                    }} 
                  onChange={(e:IReference,  nullFlavors: INullFlavorR[] | undefined)=>{
                      if (nullFlavors) certificate.nullFlavors = nullFlavors}}
                  field={<div className="p-d-flex p-flex-wrap p-jc-start">
                          <Calendar id="extReasonTime" showIcon className="p-mr-3 p-mb-2"
                            placeholder='дата' dateFormat={"dd.mm.yy"} 
                            locale="ru" mask="99.99.9999" panelStyle={{marginLeft:'12rem'}}                                         
                            value={certificate.extReasonTime} 
                            onChange={(e)=>{
                              certificate.extReasonTime = e.target.value as Date | undefined
                            }}                         
                          />
                         <Calendar id="timereason" className="p-mr-3 p-mb-2" timeOnly 
                         hourFormat="24" placeholder='время' locale="ru"           
                         value={certificate.extReasonTime}                            
                            onChange={(e)=>{
                              certificate.extReasonTime = e.target.value as Date | undefined
                            }}
                          showIcon /> 
                         <InputTextarea id="extReasonDescription" value={certificate.extReasonDescription} 
                            cols={65} rows={2} placeholder='обстоятельства'  
                            onChange={(e)=>{certificate.extReasonDescription = e.target.value }}
                          /> 
                        </div> 
                  }
                  options={options} 
                  value={NA} 
                  nullFlavors={certificate.nullFlavors}  
                  field_name="ext_reason_time"
                />                               
              </div>              
            </div>
            <div className="p-field p-d-flex p-flex-wrap p-jc-start">
              <div className='paragraph p-mr-1'>20. </div>
              <div className="p-paragraph-field p-mr-2 p-mb-2" style={dDivStyle}>
                <label htmlFor="establishedMedic">Причины смерти установлены:</label>
                <Dropdown inputId="establishedMedic" style={ddStyle} placeholder="Выбрать"  
                  options={MEDICS} optionLabel="name" autoFocus
                  value={MEDICS.find((item)=>item.code === certificate.establishedMedic)} 
                  onChange={(e) =>{
                    certificate.establishedMedic = e.value.code                    
                  }} />
              </div>  
            </div>
            <div className="p-field p-d-flex p-flex-wrap p-jc-start">
              <div className='paragraph p-mr-1'>21. </div>
              <div className="p-paragraph-field p-mr-2 p-mb-2" style={dDivStyle}>
                <label htmlFor="basisDetermining">На основании:</label>
                <Dropdown inputId="basisDetermining" style={ddStyle} placeholder="Выбрать"  
                  options={BASIS_DERMINING} optionLabel="name" autoFocus
                  value={BASIS_DERMINING.find((item)=>item.code === certificate.basisDetermining)} 
                  onChange={(e) =>{
                    certificate.basisDetermining = e.value.code                    
                  }} />
              </div>  
            </div>     
          </div>          
      </Card>  
    </>)
  }
  export default observer(Section6) 