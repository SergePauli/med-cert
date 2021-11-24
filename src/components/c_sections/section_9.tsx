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

import { INullFlavor } from '../../models/INullFlavor'
import { TRAFFIC_ACCIDENT } from '../../NSI/1.2.643.5.1.13.13.99.2.24'
import { PREGNANCY_CONNECTION } from '../../NSI/1.2.643.5.1.13.13.99.2.25'

 const Section9: FC = () => {
  const { certificateStore } = useContext(Context)
   
  const optionCode = 'NA'
  const options = NULL_FLAVORS.filter((item:IReference)=>optionCode.includes(item.code))  
  
  const header = () => {
      return <span>Прочие характеристики причины смерти</span>
    }
  const certificate = certificateStore.cert  
  const isTrafficAccident = certificate.trafficAccident !== undefined || certificate.nullFlavors.findIndex((item)=>item.parent_attr==='traffic_accident')===-1 
  const isPregnancyConnection = certificate.pregnancyConnection !== undefined || certificate.nullFlavors.findIndex((item)=>item.parent_attr==='pregnancy_connection')===-1  
  const nullFlavorDropdnStyle = {minWidth:'210px', maxWidth:'500px', marginTop: '0.5rem', marginLeft: '-0.75rem'}
  const customDropdnStyle = {minWidth:'210px', maxWidth:'500px', marginTop: '0.5rem', marginLeft: '-1.25rem'}
  const customParagraphFieldStyle = {paddingTop: '0.1rem', width: '80%'} 
      
  return (<>    
      <Card className="c-section p-mr-2 p-mb-2" header={header}>        
          <div className="p-fluid p-formgrid p-grid">
            <div className="p-field p-d-flex p-flex-wrap p-jc-start" style={{width: '98%'}} >
              <div className='paragraph p-mr-1'>23.</div>
              <div className="p-paragraph-field p-mr-2 p-mb-2" style={{width: '90%'}}>                                  
                <NullFlavorWrapper paraNum  checked={isTrafficAccident}                                      
                  label={<label htmlFor="trafficAccident">В случае смерти в результате ДТП: смерть наступила –</label>}
                  setCheck={(e:CheckboxChangeParams, nullFlavors: INullFlavor[] | undefined)=>{                      
                      if (!e.checked) {                        
                        certificate.trafficAccident = undefined                        
                      } 
                      if (nullFlavors) certificate.nullFlavors = nullFlavors
                    }} 
                  onChange={(e:IReference,  nullFlavors: INullFlavor[] | undefined)=>{
                      if (nullFlavors) certificate.nullFlavors = nullFlavors}}
                  field={
                    <Dropdown inputId="trafficAccident" style={nullFlavorDropdnStyle} placeholder="Выбрать"  
                      options={TRAFFIC_ACCIDENT} optionLabel="name" 
                      value={TRAFFIC_ACCIDENT.find((item)=> item.code === certificate.trafficAccident)} 
                      onChange={(e) =>{
                        certificate.trafficAccident =  e.value.code}
                      } 
                    />             
                  }
                  options={options} 
                  value={NA} 
                  nullFlavors={certificate.nullFlavors}  
                  field_name="traffic_accident"
                />                               
              </div>              
            </div>
            <div className="p-field p-d-flex p-flex-wrap p-jc-start" style={{width: '98%'}} >
              <div className='paragraph p-mr-1'>24.</div>
              <div className="p-paragraph-field p-mr-2 p-mb-2"  
              style={{width: '90%'}}>                                  
                <NullFlavorWrapper paraNum  checked={isPregnancyConnection}                                      
                  label={<label htmlFor="pregnancyConnection"> В случае смерти беременной (независимо от срока и локализации) </label>}
                  setCheck={(e:CheckboxChangeParams, nullFlavors: INullFlavor[] | undefined)=>{                      
                      if (!e.checked) {                        
                        certificate.pregnancyConnection = undefined                        
                      } 
                      if (nullFlavors) certificate.nullFlavors = nullFlavors
                    }} 
                  onChange={(e:IReference,  nullFlavors: INullFlavor[] | undefined)=>{
                      if (nullFlavors) certificate.nullFlavors = nullFlavors}}
                  field={
                    <Dropdown inputId="pregnancyConnection" style={nullFlavorDropdnStyle} placeholder="Выбрать"  
                      options={PREGNANCY_CONNECTION} optionLabel="name" 
                      value={PREGNANCY_CONNECTION.find((item)=> item.code === certificate.pregnancyConnection)} 
                      onChange={(e) =>{
                        certificate.pregnancyConnection = e.value.code}
                      } 
                    />             
                  }
                  options={options} 
                  value={NA} 
                  nullFlavors={certificate.nullFlavors}  
                  field_name="pregnancy_connection"
                />                               
              </div>              
            </div> 
            <div className="p-field p-d-flex p-flex-wrap p-jc-start" style={{width: '98%', paddingLeft:'0.5rem',fontWeight:600, fontSize: 'larger'}} >
              Подписи 
            </div>
            <div className="p-field p-d-flex p-flex-wrap p-jc-start" style={{width: '98%'}}>
              <div className='paragraph p-mr-1'>25. </div>
              <div className="p-paragraph-field p-mr-2 p-mb-2" style={customParagraphFieldStyle}>
                <label htmlFor="author">Врач (фельдшер, акушерка), заполнивший Медицинское свидетельство о смерти *</label>
                <Dropdown inputId="author"  placeholder="Выбрать" style={customDropdnStyle} 
                  optionLabel="name" autoFocus className="p-mb-2"                 
                  onChange={(e) =>{
                    certificate.author = e.value.code                    
                  }} />
                <label htmlFor="legalAuthenticator">Руководитель медицинской организации *</label>
                <Dropdown inputId="legalAuthenticator"  placeholder="Выбрать" style={customDropdnStyle} 
                  optionLabel="name"                  
                  onChange={(e) =>{
                    certificate.legalAuthenticator = e.value.code                    
                  }} />  
              </div>               
            </div>
            <div className="p-field p-d-flex p-flex-wrap p-jc-start" style={{width: '98%'}}>
              <div className='paragraph p-mr-1'>26. </div>
              <div className="p-paragraph-field p-mr-2 p-mb-2" style={customParagraphFieldStyle}>
                <label htmlFor="authenticator">Свидетельство проверено ответственным *</label>
                <Dropdown inputId="authenticator" placeholder="Выбрать" style={customDropdnStyle} 
                  optionLabel="name"                  
                  onChange={(e) =>{
                    certificate.authenticator = e.value.code                    
                  }} />
              </div>  
            </div>
            <div className="p-field p-d-flex p-flex-wrap p-jc-start" style={{width: '98%', paddingLeft:'0.5rem'}} >
              <em>* Заполнить в день фактического подписания бумажного носителя</em>
            </div>     
          </div>          
      </Card>  
    </>)
  }
  export default observer(Section9) 