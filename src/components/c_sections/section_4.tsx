import { observer } from "mobx-react-lite"
import { Button } from "primereact/button"
import { Card } from "primereact/card"
import { CheckboxChangeParams } from "primereact/checkbox"
import { FC, useContext, useEffect } from "react"
import { Context } from "../.."
import Address from "../../models/FormsData/Address"
import { INullFlavor } from "../../models/INullFlavor"
import { IReference } from "../../models/IReference"
import { HOME_REGION_CODE } from "../../store/addressStore"
import { ASKU, NULL_FLAVORS, UNK } from "../../utils/defaults"
import AddressFC  from "../inputs/AddressFC"
import { AreaType } from "../inputs/AreaType"
import NullFlavorWrapper from "../NullFlavorWrapper"

const Section4: FC = () => {
  const { addressStore, certificateStore } = useContext(Context)
  const certificate = certificateStore.cert   
  const address = certificate.death_addr 
  const identified = certificateStore.identified
  const checked = address !== undefined || certificate.nullFlavors().findIndex((item)=>item.parent_attr==='death_addr')===-1 
  const fromRelatives = certificateStore.fromRelatives
  
  useEffect(()=>{ 
    if (checked && address) addressStore.address = address
    else if (checked && addressStore.address.aoGUID) addressStore.address = new Address({ state: HOME_REGION_CODE, streetAddressLine: "", nullFlavors: [] })   
    },[addressStore, address, checked])
  
  const header = () => {
    return (<><span>Адрес места смерти</span><Button type="button" onClick={onAddressCopy} label="совпадает с адресом проживания" className="p-button-raised p-button-success"  /></>)
  }
  const onAddressCopy = () => {
    certificate.deathAreaType = certificate.lifeAreaType
    const lAddress = certificate.patient.address 
    if (lAddress === undefined) {
      certificate.death_addr = undefined
      if (addressStore.address.aoGUID) addressStore.address = new Address({ state: HOME_REGION_CODE, streetAddressLine: "", nullFlavors: [] })
    } else {
      if (certificate.death_addr === undefined ) certificate.death_addr = addressStore.address
      certificate.death_addr.streetAddressLine = lAddress.streetAddressLine
      certificate.death_addr.aoGUID = lAddress.aoGUID      
      certificate.death_addr.buildnum = lAddress.buildnum
      certificate.death_addr.city = lAddress.city
      certificate.death_addr.district = lAddress.district
      certificate.death_addr.flat = lAddress.flat
      certificate.death_addr.houseGUID = lAddress.houseGUID
      certificate.death_addr.housenum = lAddress.housenum
      certificate.death_addr.postalCode = lAddress.postalCode
      certificate.death_addr.state = lAddress.state
      certificate.death_addr.street = lAddress.street
      certificate.death_addr.strucnum = lAddress.strucnum
      certificate.death_addr.town = lAddress.town      
    }
    certificateStore.checkDeathArea()
    certificateStore.checkDeathAreaType()
  }
  return (<>    
    <Card className="c-section p-mr-2 p-mb-2" header={header}>        
      <div className="p-fluid p-formgrid p-grid">
        <div className="p-field p-d-flex p-flex-wrap p-jc-start" style={{width: '98%'}}>          
          <div className='paragraph p-mr-1'>10.</div>
          <AddressFC key={`p10_${address?.id}_${address?.streetAddressLine}`}
             label="Место смерти" checked={checked}  
             setCheck={(e:CheckboxChangeParams, nullFlavors: INullFlavor[] | undefined)=>{
                if (nullFlavors) certificate.setNullFlavors(nullFlavors)                  
                if (e.checked) addressStore.address = new Address({ state: HOME_REGION_CODE, streetAddressLine: "", nullFlavors: [] })
                else certificate.death_addr = undefined
                certificateStore.checkDeathArea()
              }} 
             nfValue={fromRelatives ? ASKU : UNK}
             field_name="death_addr"
             nullFlavors={certificate.nullFlavors()}             
             onChange={(value: Address)=>{
               if (certificate.death_addr !== value) certificate.death_addr=value  
               certificateStore.checkDeathArea()            
              }}/>
        </div>
        <div className="p-d-flex p-jc-center">          
          <div className='paragraph p-mr-1'>11.</div>          
          <div className='p-paragraph-field' key={`dArea_${certificate.deathAreaType}`}>
            <NullFlavorWrapper                     
              label={<label htmlFor="urban">Местность</label>}
              checked={identified || certificate.death_addr!==undefined}  
              setCheck={(e:CheckboxChangeParams, nullFlavors: INullFlavor[] | undefined)=>{
                if (nullFlavors) certificate.setNullFlavors(nullFlavors)
                if (!e.checked) certificate.deathAreaType = undefined
                certificateStore.checkDeathAreaType()
              }} 
              onChange={(e:IReference,  nullFlavors: INullFlavor[] | undefined)=>{if (nullFlavors) certificate.setNullFlavors(nullFlavors)}}
              field={<AreaType value={certificate.deathAreaType} onChange={(value: number | undefined)=>{
                certificate.deathAreaType = value
                certificateStore.checkDeathAreaType()
              }}/>}
              options={NULL_FLAVORS.filter((item:IReference)=>"ASKU UNK".includes(item.code))} 
              value={fromRelatives ? ASKU : UNK}
              field_name="death_area_type"
              nullFlavors={certificate.nullFlavors()}
            />                  
          </div>
        </div>
      </div>
    </Card>
  </>)
}
 export default observer(Section4)  