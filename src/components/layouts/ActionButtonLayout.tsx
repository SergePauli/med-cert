
import  { FC } from 'react'
import '../../styles/components/ActionButtonLayout.css'
import '../../styles/components/Tooltip.css'
import { SpeedDial } from 'primereact/speeddial'
import { Tooltip } from 'primereact/tooltip'

export interface IActionItem {
  label: string
  icon: string
  command: ()=>void
}

type ActionButtonLayoutProps = {items?: IActionItem[]}

export const ActionButtonLayout: FC<ActionButtonLayoutProps> = (props: ActionButtonLayoutProps) =>{   
  if (props.items)
  return (
  <div className="layout-action"> 
    <Tooltip target=".layout-action .p-speeddial-semi-circle.p-speeddial-direction-left .p-speeddial-action" position="left"  />   
    <SpeedDial model={props.items} radius={80}  direction="left" type="semi-circle" />
  </div>)
  else return<></> 
}