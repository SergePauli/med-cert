
import { FC } from 'react'
import { IRouteMatch } from '../models/IRouteMatch'
import { IRouteProps } from '../models/IRouteProps'
import '../styles/simplePage.css'
import '../styles/root.css'


interface IMatch extends IRouteMatch {  
  params: {error: string}
}
interface ErrorPageProps extends IRouteProps { 
    match: IMatch  
}

export const ErrorPage: FC<ErrorPageProps> = (props: ErrorPageProps) => {
  return (
    <>
      <div className="error-body">
        <div className="erpage-block">
          <h1>Ошибка!</h1>
          <div>{props.match.params.error}</div>
        </div>
      </div>  
    </>
  )
}