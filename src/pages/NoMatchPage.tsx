
import { FC } from 'react'
import '../styles/simplePage.css'
import '../styles/root.css'
export const NoMatchPage: FC = () => {  

  return (
    <>
      <div className="exception-body">
        <div className="nopage-block">
          <h1 className="nopage_h1">Неверный адрес страницы</h1>
          <div className="nopage_text">Проверьте, правильно ли вы ввели его. Если данные верны, пожалуйста, сообщите нам об ошибке.</div>
          <a className="nopage-button" href="../">На главную</a><a className="nopage-button" href="../">Сообщить об ошибке</a>
        </div>
      </div>
    </>
  )
}