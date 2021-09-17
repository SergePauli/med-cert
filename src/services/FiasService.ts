import { AxiosResponse } from "axios"
import { $fias, FIAS_URL } from "../http"
import { IFiasResponse } from "../models/responses/IFiasResponse"

export default class FiasService {
  static async getRegions(): Promise<AxiosResponse<IFiasResponse>> {
    return $fias.get(`${FIAS_URL}?level=region&limit=120`)
  }
  static async searchBar(query: string): Promise<AxiosResponse<IFiasResponse>> {
    return $fias.get(`${FIAS_URL}?searchBar=1&withParent=1&regionID=28&total_found=1&query=${query}`)
  }
}
