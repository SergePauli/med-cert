import { observer } from "mobx-react-lite"
import { Button } from "primereact/button"
import { Card } from "primereact/card"
import { CheckboxChangeParams } from "primereact/checkbox"
import { FC, useContext, useState} from "react"
import { Context } from "../.."
import { INullFlavor } from "../../models/INullFlavor"
import { IReference } from "../../models/IReference"
import { DEFAULT_ADDRESS, IAddress } from "../../models/responses/IAddress"
import { ASKU, NULL_FLAVORS, UNK } from "../../utils/defaults"
import { removeEmpty } from "../../utils/functions"
import AddressDialog from "../dialogs/AddressDialog"
import AddressFC2 from "../inputs/InputAddress"
import { AreaType } from "../inputs/AreaType"
import NullFlavorWrapper from "../NullFlavorWrapper"

const Section3: FC = () => {
  const { addressStore, certificateStore } = useContext(Context)
  const certificate = certificateStore.cert  
  const patient = certificate.patient
  const [addressLife, setAddressLife] = useState(patient.person.address) 
  const [addressDeath, setAddressDeath] = useState(certificate.deathAddr) 
  const identified = certificateStore.identified
  const checkedLifeArea = !!addressLife || patient.person.nullFlavors.findIndex((item)=>item.parent_attr==='address')===-1
  const checkedDeathArea = !!addressDeath || certificate.nullFlavors.findIndex((item)=>item.parent_attr==='death_addr')===-1  
  const fromRelatives = certificateStore.fromRelatives
  const submitted = certificateStore.submitted
  
  const header = () => {
    return <><span>Адреса мест жительства и смерти</span><Button type="button" onClick={onAddressCopy} label="СОВПАДАЮТ" className="p-button-raised p-button-success"  /></>
  }

  //copy info from life address to dead address objects
  const onAddressCopy = () => {
    certificate.deathAreaType = certificate.lifeAreaType
    let _lifeAddr = patient.person.address 
    if (_lifeAddr === undefined) certificate.deathAddr = undefined      
    else {
      _lifeAddr.id = undefined
      _lifeAddr.parent_guid = undefined
      _lifeAddr = removeEmpty(_lifeAddr) as IAddress
      let _deathAddr = {} as IAddress
      if (certificate.deathAddr?.id) _deathAddr.id = certificate.deathAddr?.id
      if (certificate.deathAddr?.parent_guid) _deathAddr.parent_guid = certificate.deathAddr?.parent_guid
      certificate.deathAddr = {..._lifeAddr,...certificate.deathAddr}               
    }    
    setAddressDeath(certificate.deathAddr)
  }
  return (<>    
    <Card className="c-section p-mr-2 p-mb-2" header={header}>        
      <div className="p-fluid p-formgrid p-grid">
        <div className="p-field p-d-flex p-jc-start" style={{width: '98%'}}>          
          <div className='paragraph p-mr-1'>8.</div>          
          <div className='p-paragraph-field' style={{width: '98%'}}>
            <NullFlavorWrapper paraNum                     
              label={<label htmlFor="addr">Место постоянного жительства(регистрации)</label>}
              checked={identified || checkedLifeArea}  
              setCheck={(e:CheckboxChangeParams, nullFlavors: INullFlavor[] | undefined)=>{
                if (nullFlavors) patient.person.nullFlavors = nullFlavors
                if (!e.checked) patient.person.address = undefined                
              }}               
              field={<AddressFC2  submitted={submitted} 
                      id='person_addr'            
                      value={addressLife || DEFAULT_ADDRESS} 
                      onClear={(value: IAddress)=>{                                               
                        patient.person.address = value
                        setAddressLife(patient.person.address)
                      }}
                      onChange={()=>{
                        patient.person.address = addressStore.addressProps()
                        console.log('patient.person.address', patient.person.address)
                        setAddressLife(patient.person.address)
                      }}  
                    />}
              options={NULL_FLAVORS.filter((item:IReference)=>"ASKU UNK".includes(item.code))} 
              value={fromRelatives ? ASKU : UNK}
              field_name="address"
              nullFlavors={patient.person.nullFlavors}
            />                  
          </div>
        </div>
        <div className="p-d-flex p-jc-center">          
          <div className='paragraph p-mr-1'>9.</div>          
          <div className='p-paragraph-field'>
            <NullFlavorWrapper                     
              label={<label htmlFor="urban">Местность</label>}
              checked={identified || !!certificate.lifeAreaType}  setCheck={(e:CheckboxChangeParams, nullFlavors: INullFlavor[] | undefined)=>{
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
        <div className="p-field p-d-flex p-jc-start" style={{width: '98%'}}>          
          <div className='paragraph p-mr-1'>10.</div>          
          <div className='p-paragraph-field' style={{width: '98%'}}>
            <NullFlavorWrapper paraNum                     
              label={<label htmlFor="death_addr">Адрес места смерти</label>}
              checked={identified || checkedDeathArea}  
              setCheck={(e:CheckboxChangeParams, nullFlavors: INullFlavor[] | undefined)=>{
                if (nullFlavors) certificate.nullFlavors = nullFlavors
                if (!e.checked) certificate.deathAddr = undefined                
              }}               
              field={<AddressFC2  submitted={submitted} 
                      id='death_addr'            
                      value={addressDeath || DEFAULT_ADDRESS} 
                      onClear={(value: IAddress)=>{                                               
                        certificate.deathAddr = value 
                        setAddressDeath(certificate.deathAddr)                       
                      }}
                      onChange={()=>{
                        certificate.deathAddr = addressStore.addressProps()  
                        setAddressDeath(certificate.deathAddr)                      
                      }}  
                    />}
              options={NULL_FLAVORS.filter((item:IReference)=>"ASKU UNK".includes(item.code))} 
              value={fromRelatives ? ASKU : UNK}
              field_name="death_addr"
              nullFlavors={certificate.nullFlavors}
            />                  
          </div>
        </div>
        <div className="p-d-flex p-jc-center">          
          <div className='paragraph p-mr-1'>11.</div>          
          <div className='p-paragraph-field' key={`dArea_${certificate.deathAreaType}`}>
            <NullFlavorWrapper                     
              label={<label htmlFor="urban">Местность</label>}
              checked={identified || certificate.deathAddr!==undefined}  
              setCheck={(e:CheckboxChangeParams, nullFlavors: INullFlavor[] | undefined)=>{
                if (nullFlavors) certificate.nullFlavors = nullFlavors
                if (!e.checked) certificate.deathAreaType = undefined
              }} 
              onChange={(e:IReference,  nullFlavors: INullFlavor[] | undefined)=>{if (nullFlavors) certificate.nullFlavors = nullFlavors}}
              field={<AreaType value={certificate.deathAreaType} onChange={(value: number | undefined)=>{
                certificate.deathAreaType = value
              }}/>}
              options={NULL_FLAVORS.filter((item:IReference)=>"ASKU UNK".includes(item.code))} 
              value={fromRelatives ? ASKU : UNK}
              field_name="death_area_type"
              nullFlavors={certificate.nullFlavors}
            />                  
          </div>
        </div>        
      </div>
    </Card>
    <AddressDialog /> 
  </>)
}
 export default observer(Section3)  