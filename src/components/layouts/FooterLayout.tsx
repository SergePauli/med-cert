import { IUserInfo } from "../../models/responses/IUserInfo"
import {ROLES}  from "../../utils/consts"

type FooterLayoutProps = {userInfo: IUserInfo | null}
const FooterLayout = (props: FooterLayoutProps) => {
  const orgName = props.userInfo!==null && props.userInfo.organization ? props.userInfo.organization.name : ''
  const profile = props.userInfo!==null && props.userInfo.roles ? ROLES[props.userInfo.roles.split(' ')[0]]: ''  
  return (
    <div className="layout-footer">
      <div className="footer-logo-container">
        <span className="app-name">{orgName}:</span>
        <span className="app-profile">{profile}</span>
      </div>
      <span className="copyright">2022 © ГБУЗ АО "АМИАЦ"</span>
    </div>       
  )
}
export default FooterLayout