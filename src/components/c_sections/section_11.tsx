import { observer } from "mobx-react-lite"
import { Button } from "primereact/button"
import { Card } from "primereact/card"
import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"
import { Steps } from 'primereact/steps'
import { useCallback, useEffect, useState } from "react"
import { FC, useContext } from "react"
import { Context } from "../.."
import CertificateService from "../../services/CertificateService"
import '../../styles/components/Steps.css'
import XMLViewer from "../../types/react-xml-viewer"
import CRC32 from "../../types/crc-32"
import { CheckForPlugIn, FillCAdESList, SignCadesBES, STATUS_OK } from "../../utils/async_code"
import { cadesplagin } from "../../utils/cadesplugin_api"
import { InputTextarea } from "primereact/inputtextarea"
import { CRIPTO_PRO_CSP_SUG, CSP_PLAGIN_SUG, CSP_SELECT_SUG } from "../../utils/defaults"
import RREMD_Service from "../../services/RREMDService"
import { ISignature } from "../../models/requests/IPostDocumentR"
declare global {
  interface Window {
    cadesplugin?: any
    cpcsp_chrome_nmcades?: any
  }
}
interface CSP_PlagIn_Info {
    PlugInEnabled: boolean
    PlugInEnabledTxt: string
    PlugInVersionTxt: string
    CspEnabled: boolean
    CspEnabledTxt: string  
    CSPVersionTxt?: string  
  }
interface ICAdESInfo {
  serialNumber: string
  text: string
  status: string
}  
interface IСAdESLists {
  certsList: any[]
  infoList: ICAdESInfo[] 
}  
interface ISignedData {
  signatureTxt: string
  signature: string
  errormes: string
}
const Section11: FC = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const [s_token, setS_token] = useState<string | undefined>()
  const [cadesplugin_loaded, setCadesplugin_loaded] = useState<boolean | undefined>()
  const [versionPlagin, setVersionPlagin] = useState<CSP_PlagIn_Info | undefined>()
  const [dataToSignXML, setDataToSignXML] = useState<null | string>(null)
  const [signature, setSignature] = useState<null | string>(null)
  const [cAdES, setCAdES] = useState<IСAdESLists | null>(null)
  const [selectedCAdES, setSelectedCAdES] = useState<ICAdESInfo | undefined>()
  const { certificateStore, suggestionsStore, layoutStore, userStore } = useContext(Context)
  const certificate = certificateStore.cert 
  useEffect(()=>{   
    if ( dataToSignXML===null) {
      setDataToSignXML("<warn>Загрузка....</warn>")
      CertificateService.getCDA(certificate.id)
      .then(data=>{        
        setDataToSignXML(data.data)
        setActiveIndex(1)        
      })
      .catch(reason=>{
        setDataToSignXML(`<error>${reason.message}</error>`)        
      })      
    } 
  },[certificate.id, dataToSignXML, layoutStore])
  const plugin_waiting = useCallback((count: number)=>{
    setTimeout(()=>{
      CheckForPlugIn()
      .then((csp_info: CSP_PlagIn_Info | undefined)=>{                   
       if (csp_info && csp_info.PlugInEnabled) { 
        setVersionPlagin({...csp_info})
        setCadesplugin_loaded(true)
       } else if (count < 15) 
          plugin_waiting(++count)
        else setLoading(false)
      })        
    }, 500)  
  },[])
  useEffect(()=>{         
    if (cadesplugin_loaded === undefined) { 
      cadesplagin() 
      setCadesplugin_loaded(false)
    }   
  },[cadesplugin_loaded])
  useEffect( ()=>{
    if (cadesplugin_loaded===false && !versionPlagin) {                   
      plugin_waiting(0)
    }
  },[cadesplugin_loaded, plugin_waiting, versionPlagin])
  useEffect(()=>{
    if (cAdES===null && versionPlagin && versionPlagin.CspEnabled) {
      setLoading(true)
      FillCAdESList().then(result=>{
        //console.log('result',result )
        if (result) setCAdES(result)
        else setCAdES(null)
      }).finally(()=>setLoading(false))
    }
  },[cAdES, versionPlagin, versionPlagin?.CspEnabled])
  useEffect(()=>{
    if (versionPlagin && versionPlagin.PlugInEnabled) 
    suggestionsStore.suggestions[CSP_PLAGIN_SUG].done = true
    if (versionPlagin && versionPlagin.CspEnabled) 
    suggestionsStore.suggestions[CRIPTO_PRO_CSP_SUG].done = true
    if (selectedCAdES)
    suggestionsStore.suggestions[CSP_SELECT_SUG].done = true
    else suggestionsStore.suggestions[CSP_SELECT_SUG].done = false
  },[selectedCAdES, suggestionsStore.suggestions, versionPlagin])
  
  const signData = () => {
    if (cAdES===null || selectedCAdES===undefined || activeIndex!==1) return
    const idx = cAdES.infoList.indexOf(selectedCAdES)
    setSignature('Подписываем....')
    if (idx > -1) SignCadesBES(cAdES.certsList[idx], dataToSignXML)
    .then((result:ISignedData)=>{      
     if (result.signature) {
       setSignature(`${result.signatureTxt}\n${result.signature}`)
        setActiveIndex(2)
     } else setSignature(`${result.errormes}`)
    })
    .catch((reason)=>{
      console.log('reason',reason)
      setSignature(reason)
    })    
  }
  const getToken = () => {
    if (cAdES===null || selectedCAdES===undefined 
      || activeIndex!==2 || !userStore.userInfo) return
    const idx = cAdES.infoList.indexOf(selectedCAdES)
    const oid =  userStore.userInfo.organization.oid
    const originalString = JSON.stringify({sub:oid})
    if (idx > -1) SignCadesBES(cAdES.certsList[idx], originalString)
    .then((res:ISignedData)=>{      
     if (res.signature) {
      RREMD_Service.auth({oid, originalString, signedString: res.signature})
      .then(data=>{
        console.log('data',data)
         setActiveIndex(3)
      })
      .catch((reason)=>{
        console.log('reason1',reason)      
      })
      if (userStore.userInfo && signature) certificateStore.postRequestGenerator(userStore.userInfo, { data: signature, checksum: CRC32.str(signature) }, {data: signature, checksum: CRC32.str(signature) } ) 
     } 
    })
    .catch((reason)=>{
      console.log('reason2',reason)      
    })   
  }
  const header = () => {
      return <span>Выгрузка в РРЭМД</span>
  }    
  const items = [
    {
      label: 'СЭМД',      
    },    
    {
      label: 'Подпись',      
    },
    {
      label: 'Токен',      
    },
    {
      label: 'РРЭМД',      
    }
  ]
  const footer = <span>    
    <Button label="Подписать" icon="pi pi-pencil"
     style={{marginRight: '.25em'}} disabled={!selectedCAdES}
     onClick={signData}/>
     <Button label="запросить токен" icon="pi pi-check" className="p-button-warning"
     onClick={getToken}
     title="Запросить токен безопасности в РРЭМД (используйте ЭЦП медорганизации)" style={{marginRight: '.25em'}} disabled={!selectedCAdES || !!s_token} />
    <Button label="Отозвать" icon="pi pi-times" className="p-button-secondary"/>
  </span>
  //console.log('cAdES', cAdES) 
  const isRowSelectable = (event: any) => {
        const data = event.data
        return data.status===STATUS_OK
    }
  const rowClassName = (data: ICAdESInfo) => {
        return data.status===STATUS_OK ? '' : 'p-disabled'
  }  
  return (    
    <Card className="c-section p-mr-2 p-mb-2" header={header}
      footer={footer} style={{paddingLeft:'1rem'}}>
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
        <div className="p-field p-col-12" >
          <InputTextarea value={(versionPlagin && `${versionPlagin?.PlugInEnabledTxt}\n${versionPlagin?.PlugInVersionTxt || 'Версия не получена'}\n${versionPlagin?.CspEnabledTxt}\n${versionPlagin?.CSPVersionTxt || ''}`) || ''} rows={5} cols={30} disabled />          
        </div>       
        <div className="p-field p-col-12">            
            <label htmlFor="CertListBox">Выберите сертификат ЭЦП:</label>
            <DataTable id="CertListBox" value={cAdES?.infoList || []} emptyMessage="Не найдены доступные ЭЦП в хранилище" responsiveLayout="scroll" onSelectionChange={e => setSelectedCAdES(e.value)} dataKey="serialNumber" rowClassName={rowClassName} selectionMode="single"
            isDataSelectable={isRowSelectable} selection={selectedCAdES} loading={loading}> 
              <Column field="text" header="Издатель"></Column>              
              <Column field="status" header="Статус"></Column>
            </DataTable>
        </div>
        <div className="p-field p-col-12" >
          <label htmlFor="SignatureTxtBox">Подпись</label> 
          <InputTextarea id="SignatureTxtBox" value={signature || ''} rows={5} cols={30}  />          
        </div> 
      </div>
    </Card >
  )  
}
export default observer(Section11)