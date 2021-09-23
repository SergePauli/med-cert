import { AxiosResponse } from "axios"
import { $fias, FIAS_URL } from "../http"
import { IFiasResponse } from "../models/responses/IFiasResponse"
import { HOME_REGION_CODE } from "../store/addressStore"

export default class FiasService {
  static async getRegions(): Promise<AxiosResponse<IFiasResponse>> {
    return $fias.get(`${FIAS_URL}?level=region&limit=120`)
  }
  static async searchBar(query: string, regionID = HOME_REGION_CODE as string): Promise<AxiosResponse<IFiasResponse>> {
    return $fias.get(`${FIAS_URL}?searchBar=1&withParent=1&regionID=${regionID}&total_found=1&query=${query}`)
  }
  static async getChildItems(parent: string, level: string, query = ""): Promise<AxiosResponse<IFiasResponse>> {
    const parentOpt = parent.length === 2 ? `regionID=${parent}` : `parent=${parent}`
    return $fias.get(`${FIAS_URL}?${parentOpt}&withParent=1&level=${level}&query=${query}&limit=120`)
  }
}
