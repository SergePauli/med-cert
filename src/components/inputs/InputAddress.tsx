import { observer } from 'mobx-react-lite'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { classNames } from 'primereact/utils'
import { FC, useContext, useEffect } from 'react'
import { Context } from '../..'
import Address from '../../models/FormsData/Address'
import { DEFAULT_ADDRESS, IAddress } from '../../models/responses/IAddress'


type InputAddressProps = { 
  submitted: boolean // is it form submitted already
  value: IAddress // object, containing address
  onClear: (value: IAddress)=>void // setter to state value in the form>
  onChange: ()=>void // setter to state new value from dialog to form 
  label?: string
  strictly?: boolean // if address need to be all from FIAS
  className?: string // styles for main div  
  id?: string 
}

const InputAddress: FC<InputAddressProps> = (props: InputAddressProps) =>{ 
  const submitted = props.submitted
  const value = props.value
  const {addressStore} = useContext(Context)

  const invalid = props.strictly ? !value || !value.houseGUID
     : !value || value.streetAddressLine.split(',').length < 3
  
  const bt_id = `bt_addr_${props.id}`   
  
  useEffect(()=>{addressStore.address = new Address(props.value || DEFAULT_ADDRESS)
  },[addressStore, props.value])

   useEffect(()=>{
    if (addressStore.manualMode!== !props.strictly) {
      addressStore.manualMode = !props.strictly 
    }
  },[addressStore, props.strictly])

  return (<div className={classNames({'p-field': !!props.label}, props.className)} >
    {props.label && <label htmlFor={bt_id}>{props.label}</label>}
    <div className='p-inputgroup'>
      <Button id='bt_addr_dialog' label="Ввод" onClick={()=>{
        addressStore.dialogVisible = true
        addressStore.onAddrComplete = props.onChange}} style={{width:'5rem'}}/>
      <InputText 
        title={value?.streetAddressLine}
        value={value?.streetAddressLine}
        placeholder={'введите адрес вида: Амурская область, Н-ский район, село Тосево, улица Товарная, дом 13, кв. 9' } className={classNames({ 'p-invalid': submitted && invalid})} />
      <Button icon="pi pi-times" className="p-button-danger" onClick={()=>{
        if (!value) return        
        let _addr = DEFAULT_ADDRESS
        if (value.id) _addr.id = value.id
        if (value.parent_guid) _addr.parent_guid = value.parent_guid
        if (value.null_flavors) _addr.null_flavors = value.null_flavors
        if (value.null_flavors_attributes) _addr.null_flavors = value.null_flavors_attributes
        props.onClear(_addr)
        addressStore.address = new Address(_addr)}}
      />
    </div>
    {submitted && invalid && <small className="p-error">Адресс введен не полностью или отсутствует</small>}
  </div>)  
}
export default observer(InputAddress)