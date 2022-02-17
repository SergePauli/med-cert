import { AxiosResponse } from "axios"
import { $acme, ACME_URL } from "../http"

export default class ACMEService {
  //POST request for run ACME and get result
  static async runACME(input: string): Promise<AxiosResponse<string>> {
    return $acme.post(`${ACME_URL}useACME`, { data_AIN: input })
  }
}
