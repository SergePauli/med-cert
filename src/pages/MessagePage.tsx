
import { FC } from 'react';
import { IRouteMatch } from '../models/IRouteMatch';
import { IRouteProps } from '../models/IRouteProps';

interface IParams {message: string}
interface IMatch extends IRouteMatch {  
  params: IParams
}
interface MessagePageProps extends IRouteProps {  
  match: IMatch  
}


export const MessagePage: FC<MessagePageProps> = (props: MessagePageProps) => {
  return (
    <>
      <h1>Внимание:</h1>
      <div>{props.match.params.message}!</div>
    </>
  )
}