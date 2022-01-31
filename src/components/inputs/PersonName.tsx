import { InputText } from 'primereact/inputtext'
import { classNames } from 'primereact/utils'
import { FC, useState } from 'react'
import { getOneLinePersonName, IPersonName } from '../../models/IPersonName'

type PersonNameProps = {
  personName?: IPersonName
  submitted?:boolean
  onChange:(personName: IPersonName)=>void
}
export const PersonName:FC<PersonNameProps> = (props:PersonNameProps) =>{
  const [fio, setFio] = useState(getOneLinePersonName(props.personName)) 
  const isErrorMessage = props.submitted && (!props.personName || !props.personName.family || !props.personName.given_1)
  return (<>
    <InputText  id="fio" type="text" 
      value={fio}                    
      onChange={(e)=>{
        setFio(e.target.value)               
        const values = e.target.value.trim().split(" ")
        let _result = {} as IPersonName
        if (props.personName?.id) _result.id = props.personName?.id
        if (values && values.length > 1) {
          _result = {..._result, family: values[0], given_1: values[1]} as IPersonName
          if (values[2]) _result.given_2 = values[2]                      
        } else  _result = {..._result, family: '', given_1: ''} as IPersonName
        props.onChange(_result)                                      
      }}
      className={classNames({ 'p-invalid': isErrorMessage})}
    />
    {isErrorMessage && <small className="p-error">Фамилия, имя обязательны</small>}
  </>)
} 