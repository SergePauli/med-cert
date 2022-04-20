import { observer } from "mobx-react-lite"
import { Button } from "primereact/button"
import { Card } from "primereact/card"
import { Steps } from 'primereact/steps'
import React, { useEffect, useState } from "react"
import { FC, useContext } from "react"
import { Context } from "../.."
import CertificateService from "../../services/CertificateService"
import '../../styles/components/Steps.css'
import XMLViewer from "../../types/react-xml-viewer"

const Section11: FC = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [dataToSignXML, setDataToSignXML] = useState<null | string>(null)
  const { certificateStore, suggestionsStore, layoutStore } = useContext(Context)
  const certificate = certificateStore.cert 
  useEffect(()=>{   
    if ( dataToSignXML===null) {
      //layoutStore.isLoading = true
      CertificateService.getCDA(certificate.id)
      .then(data=>{
        //console.log('data', data )
        setDataToSignXML(data.data)
        setActiveIndex(1)
        //layoutStore.isLoading = false
      })
      .catch(reason=>{
        setDataToSignXML(`<error>${reason.message}</error>`)
        //layoutStore.isLoading = false
      })      
    } //else if (layoutStore.isLoading) layoutStore.isLoading = false
  },[certificate.id, dataToSignXML, layoutStore, layoutStore.isLoading])
  const header = () => {
      return <span>Выгрузка в РРЭМД</span>
  }    
  const items = [
    {
      label: 'Создать(обновить) СЭМД',      
    },    
    {
      label: 'Подписать ЭЦП',      
    },
    {
      label: 'Выгрузить СЭМД в РРЭМД',      
    }
  ]

  return (    
    <Card className="c-section p-mr-2 p-mb-2" header={header} style={{paddingLeft:'1rem'}}>
      <div className="p-fluid p-formgrid p-grid">
        <Steps model={items} activeIndex={activeIndex} className="p-field p-col-12" />      
        <div className="p-field p-col-12">
          <label htmlFor="sign_data">Данные СЭМД</label>
          <div id="sign_data" style={{overflow: 'auto', 
          height: "344px", 
          width: "100%", 
          resize: "none", 
          border: "1px solid #dee2e6",
          borderRadius: "4px",
          padding: "0.5rem"
          }}>
            <XMLViewer xml={dataToSignXML || "<ClinicalDocument>Данные отсутствуют</ClinicalDocument>"} 
            collapsible={true}/>
          </div>        
          
      </div>
      </div>
    </Card>
  )  
}
export default observer(Section11)