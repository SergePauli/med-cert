import { AxiosResponse } from "axios"
import { $rremd, RREMD_URL } from "../http"

export interface IRREMDAuth {
  oid: string
  originalString: string
  signedString: string
}
export default class RREMD_Service {
  static async auth(params: IRREMDAuth): Promise<AxiosResponse<any>> {
    return $rremd.get(
      `${RREMD_URL}auth?oid=${params.oid}&originalString=${params.originalString}&signedString=${params.signedString}`
    )
  }
  static async documentPost(params: IRREMDAuth): Promise<AxiosResponse<any>> {
    return $rremd.post(`${RREMD_URL}documents?securityToken=${localStorage.getItem("securityToken")}`)
  }
}
