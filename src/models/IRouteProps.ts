import { IRouteLocation } from "./IRouteLocation"
import { IRouteMatch } from "./IRouteMatch"

export interface IRouteProps {
  match: IRouteMatch
  location: IRouteLocation
}
