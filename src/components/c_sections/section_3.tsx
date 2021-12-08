import { observer } from "mobx-react-lite"
import { Card } from "primereact/card"
import { CheckboxChangeParams } from "primereact/checkbox"
import { FC, useContext, useEffect } from "react"
import { Context } from "../.."
import Address from "../../models/FormsData/Address"
import { INullFlavor } from "../../models/INullFlavor"
import { IReference } from "../../models/IReference"
import { ASKU, HOME_REGION_CODE, NULL_FLAVORS, UNK } from "../../utils/defaults"
import AddressFC  from "../inputs/AddressFC"
import { AreaType } from "../inputs/AreaType"
import NullFlavorWrapper from "../NullFlavorWrapper"

const Section3: FC = () => {
  const { addressStore, certificateStore } = useContext(Context)
  const certificate = certificateStore.cert  
  const patient = certificate.patient
  const address = patient.address 
  const identified = certificateStore.identified
  const checked = address !== undefined || patient.nullFlavors().findIndex((item)=>item.parent_attr==='addr')===-1 
  const fromRelatives = certificateStore.fromRelatives
  useEffect(()=>{ 
    if (checked && address) addressStore.address = address
    else if (checked && addressStore.address.aoGUID) addressStore.address = new Address({ state: HOME_REGION_CODE, streetAddressLine: "", nullFlavors: [] })     
    },[addressStore, address, checked])
  const header = () => {
    return <span>Адрес места жительства</span>
  }
  return (<>    
    <Card className="c-section p-mr-2 p-mb-2" header={header}>        
      <div className="p-fluid p-formgrid p-grid">
        <div className="p-field p-d-flex p-flex-wrap p-jc-start" style={{width: '98%'}}>
          <div className='paragraph p-mr-1'>8.</div>
          <AddressFC key={`p8_${address?.id}_${address?.streetAddressLine}`}
             label="Место постоянного жительства(регистрации)"
             checked={checked} paraNum 
             setCheck={(e:CheckboxChangeParams, nullFlavors: INullFlavor[] | undefined)=>{
                if (nullFlavors) patient.setNullFlavors(nullFlavors)
                if (e.checked) addressStore.address = new Address({ state: HOME_REGION_CODE, streetAddressLine: "", nullFlavors: [] })
                else patient.address = undefined                
              }} 
             nfValue={fromRelatives ? ASKU : UNK}
             field_name="addr"
             nullFlavors={patient.nullFlavors()}             
             onChange={(value: Address)=>{
               if (patient.address !== value) patient.address=value                            
              }}/>
        </div>
        <div className="p-d-flex p-jc-center">          
          <div className='paragraph p-mr-1'>9.</div>          
          <div className='p-paragraph-field'>
            <NullFlavorWrapper                     
              label={<label htmlFor="urban">Местность</label>}
              checked={identified || patient.address!==undefined}  setCheck={(e:CheckboxChangeParams, nullFlavors: INullFlavor[] | undefined)=>{
                if (nullFlavors) certificate.nullFlavors = nullFlavors
                if (!e.checked) certificate.lifeAreaType = undefined                
              }} 
              onChange={(e:IReference,  nullFlavors: INullFlavor[] | undefined)=>{if (nullFlavors) certificate.nullFlavors = nullFlavors}}
              field={<AreaType value={certificate.lifeAreaType} onChange={(value: number | undefined)=>{
                certificate.lifeAreaType = value                
              }}/>}
              options={NULL_FLAVORS.filter((item:IReference)=>"ASKU UNK".includes(item.code))} 
              value={fromRelatives ? ASKU : UNK}
              field_name="life_area_type"
              nullFlavors={certificate.nullFlavors}
            />                  
          </div>
        </div>
      </div>
    </Card>
  </>)
}
 export default observer(Section3)  