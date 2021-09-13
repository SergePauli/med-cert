import { observer } from "mobx-react-lite"
import { Card } from "primereact/card"
import { CheckboxChangeParams } from "primereact/checkbox"
import { FC, useContext } from "react"
import { Context } from "../.."
import { INullFlavor } from "../../models/INullFlavor"
import { IReference } from "../../models/IReference"
import { ASKU, NULL_FLAVORS, UNK } from "../../utils/defaults"
import { AreaType } from "../inputs/AreaType"
import NullFlavorWrapper from "../NullFlavorWrapper"

const Section3: FC = () => {
  const { certificateStore } = useContext(Context)
  const certificate = certificateStore.cert
  const identified = certificateStore.identified
  const fromRelatives = certificateStore.fromRelatives
  const header = () => {
    return <span>Место постоянного жительства(регистрации)</span>
  }
  return (<>    
    <Card className="c-section p-mr-2 p-mb-2" header={header}>        
      <div className="p-fluid p-formgrid p-grid">
        <div className="p-d-flex p-jc-center">
          <div className='paragraph p-mr-1'>9.</div>
          <div className='p-paragraph-field'>
            <NullFlavorWrapper                     
              label={<label htmlFor="urban">Вид места жительства</label>}
              checked={identified} setCheck={(e:CheckboxChangeParams, nullFlavors: INullFlavor[] | undefined)=>{
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