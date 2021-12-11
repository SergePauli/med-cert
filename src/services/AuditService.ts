import { AxiosResponse } from "axios"
import $api, { API_URL } from "../http"
import { ITimeEvent } from "../models/responses/ITimeEvent"

//Стандартные настройки JSON рендеринга модели timeEvent
export const TIME_EVENT_OPTIONS = {
  render_options: {
    only: ["id", "summary", "table", "action", "detail", "created_at"],
    include: ["user", "organization"],
  },
  includes: ["user", "organization"],
  user: { only: ["id", "email"], include: ["person_name"] },
  organization: { only: ["id", "name"] },
}
export default class AuditService {
  //POST request for get audit's list
  static async getAudits(query: any): Promise<AxiosResponse<ITimeEvent[]>> {
    return $api.post(`${API_URL}model/Audit/`, { ...query, ...TIME_EVENT_OPTIONS })
  }
}
