import { observer } from "mobx-react-lite"
import { Card } from "primereact/card"
import { CheckboxChangeParams } from "primereact/checkbox"
import { FC, useContext } from "react"
import { Context } from "../.."
import Address from "../../models/FormsData/Address"
import { INullFlavor } from "../../models/INullFlavor"
import { IReference } from "../../models/IReference"
import { ASKU, NULL_FLAVORS, UNK } from "../../utils/defaults"
import AddressFC  from "../inputs/AddressFC"
import { AreaType } from "../inputs/AreaType"
import NullFlavorWrapper from "../NullFlavorWrapper"

const Section3: FC = () => {
  const { addressStore, certificateStore } = useContext(Context)
  const certificate = certificateStore.cert  
  const patient = certificate.patient
  const address = addressStore.address 
  const identified = certificateStore.identified
  const fromRelatives = certificateStore.fromRelatives
  const header = () => {
    return <span>Место постоянного жительства(регистрации)</span>
  }
  return (<>    
    <Card className="c-section p-mr-2 p-mb-2" header={header}>        
      <div className="p-fluid p-formgrid p-grid">
        <div className="p-field p-d-flex p-flex-wrap p-jc-start">
          <div className='paragraph p-mr-1'>8.</div>
          <AddressFC key={`p8_${patient.address?.id}`}
             checked={patient.address!==undefined}  
             setCheck={(e:CheckboxChangeParams, nullFlavors: INullFlavor[] | undefined)=>{
                if (nullFlavors) patient.setNullFlavors(nullFlavors)
                if (e.checked) patient.address = address  
                else patient.address = undefined
                certificateStore.checkLifeAreaType()
              }} 
             nfValue={fromRelatives ? ASKU : UNK}
             field_name="addr_id"
             nullFlavors={patient.nullFlavors()}             
             onChange={(value: Address)=>patient.address=address}
          />
        </div>
        <div className="p-d-flex p-jc-center">          
          <div className='paragraph p-mr-1'>9.</div>          
          <div className='p-paragraph-field'>
            <NullFlavorWrapper                     
              label={<label htmlFor="urban">Местность</label>}
              checked={identified || patient.address!==undefined}  setCheck={(e:CheckboxChangeParams, nullFlavors: INullFlavor[] | undefined)=>{
                if (nullFlavors) certificate.setNullFlavors(nullFlavors)
                if (!e.checked) certificate.lifeAreaType = undefined
                certificateStore.checkLifeAreaType()
              }} 
              onChange={(e:IReference,  nullFlavors: INullFlavor[] | undefined)=>{if (nullFlavors) certificate.setNullFlavors(nullFlavors)}}
              field={<AreaType value={certificate.lifeAreaType} onChange={(value: number | undefined)=>{
                certificate.lifeAreaType = value
                certificateStore.checkLifeAreaType()
              }}/>}
              options={NULL_FLAVORS.filter((item:IReference)=>"ASKU UNK".includes(item.code))} 
              value={fromRelatives ? ASKU : UNK}
              field_name="life_area_type"
              nullFlavors={certificate.nullFlavors()}
            />                  
          </div>
        </div>
      </div>
    </Card>
  </>)
}
 export default observer(Section3)  