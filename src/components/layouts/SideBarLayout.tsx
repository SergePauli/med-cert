import avatar from "../images/logo.svg"
const SideBarLayout = () => {
  return (
    <div className='layout-sidebar'>
        <a className='logo' href='#/'>
          <img id='app-logo' className='logo-image' src={avatar} alt='diamond layout' />
          <span className='app-name'>МЕДСС</span>
        </a>
        <div className='layout-menu-container'>
          <ul className='layout-menu' role='menu'>
            <li className='layout-root-menuitem' role='menuitem'>
              <button type='button' className='p-ripple p-link'>
                <i className='layout-menuitem-icon pi pi-fw pi-home'></i>
                <span className='layout-menuitem-text'>Избранное</span>
                <i className='pi pi-fw pi-angle-down layout-submenu-toggler'></i>
              </button>
              <div className='layout-root-menuitem'>
                <div className='layout-menuitem-root-text' style={{ textTransform: "uppercase" }}>
                  Избранное
                </div>
              </div>
              <ul className='layout-menu' role='menu'>
                <li role='menuitem'>
                  <a className='p-ripple' href='/'>
                    <i className='layout-menuitem-icon pi pi-fw pi-home'></i>
                    <span className='layout-menuitem-text'>Главная</span>
                  </a>
                </li>
              </ul>
            </li>
            <li className='layout-root-menuitem' role='menuitem'>
              <button type='button' className='p-ripple p-link'>
                <i className='layout-menuitem-icon pi pi-fw pi-id-card'></i>
                <span className='layout-menuitem-text'>Операции</span>
                <i className='pi pi-fw pi-angle-down layout-submenu-toggler'></i>
              </button>
              <div className='layout-root-menuitem'>
                <div className='layout-menuitem-root-text' style={{ textTransform: "uppercase" }}>
                  Операции
                </div>
              </div>
              <ul className='layout-menu' role='menu'>
                <li className='' role='menuitem'>
                  <a className='p-ripple active-route' href='/list' aria-current='page'>
                    <i className='layout-menuitem-icon pi pi-fw pi-list'></i>
                    <span className='layout-menuitem-text'>Список</span>
                  </a>
                </li>
              </ul>
            </li>
            <li className='layout-root-menuitem' role='menuitem'>
              <button type='button' className='p-ripple p-link'>
                <i className='layout-menuitem-icon pi pi-fw pi-id-card'></i>
                <span className='layout-menuitem-text'>Ввод</span>
                <i className='pi pi-fw pi-angle-down layout-submenu-toggler'></i>
              </button>
              <div className='layout-root-menuitem'>
                <div className='layout-menuitem-root-text' style={{ textTransform: "uppercase" }}>
                  Ввод
                </div>
              </div>
              <ul className='layout-menu' role='menu'>
                <li className='' role='menuitem'>
                  <a className='p-ripple active-route' href='#/' aria-current='page'>
                    <i className='layout-menuitem-icon pi pi-fw pi-check-square'></i>
                    <span className='layout-menuitem-text'>пункты 5,6</span>
                  </a>
                </li>
                <li className='' role='menuitem'>
                  <a className='p-ripple active-route' href='#/' aria-current='page'>
                    <i className='layout-menuitem-icon pi pi-fw pi-check-square'></i>
                    <span className='layout-menuitem-text'>пункты 7,8</span>
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>      
  )
}
export default SideBarLayout