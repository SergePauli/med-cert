import React from "react"
import { Menu } from "primereact/menu"
import { classNames, ObjectUtils } from "primereact/utils"
export class LayoutMenu extends Menu {
  renderSubmenu(submenu, index) {
    const className = classNames(
      "p-submenu-header layout-root-menuitem",
      { "p-disabled": submenu.disabled },
      submenu.className
    )
    const items = submenu.items.map((item, index) => {
      return this.renderMenuitem(item, index)
    })

    return (
      <React.Fragment key={submenu.label + "_" + index}>
        <li className={className} style={submenu.style} role='menuitem' aria-disabled={submenu.disabled}>
          <button type='button' class='p-ripple p-link'>
            <i className={`layout-menuitem-icon ${submenu.icon}`}></i>
            <span className='layout-menuitem-text'>{submenu.label}</span>
            <i className='pi pi-fw pi-angle-down layout-submenu-toggler'></i>
          </button>
          <div className='layout-root-menuitem'>
            <div className='layout-menuitem-root-text' style={{ textTransform: "uppercase" }}>
              {submenu.label}
            </div>
          </div>
        </li>
        {items}
      </React.Fragment>
    )
  }
  renderMenuitem(item, index) {
    const className = classNames("p-menuitem", item.className)
    const linkClassName = classNames("p-menuitem-link p-ripple", { "p-disabled": item.disabled })
    const iconClassName = classNames("layout-menuitem-icon", item.icon)
    const icon = item.icon && <span className={iconClassName}></span>
    const label = item.label && <span className='layout-menuitem-text'>{item.label}</span>
    const tabIndex = item.disabled ? null : 0
    let content = (
      <a
        href={item.url || "#"}
        className={linkClassName}
        target={item.target}
        onClick={(event) => this.onItemClick(event, item)}
        onKeyDown={(event) => this.onItemKeyDown(event, item)}
        tabIndex={tabIndex}
        aria-disabled={item.disabled}>
        {icon}
        {label}
      </a>
    )

    if (item.template) {
      const defaultContentOptions = {
        onClick: (event) => this.onItemClick(event, item),
        onKeyDown: (event) => this.onItemKeyDown(event, item),
        className: linkClassName,
        tabIndex: tabIndex,
        labelClassName: "layout-menuitem-text",
        iconClassName,
        element: content,
        props: this.props,
      }

      content = ObjectUtils.getJSXElement(item.template, item, defaultContentOptions)
    }

    return (
      <li key={item.label + "_" + index} className={className} style={item.style} role='menuitem'>
        {content}
      </li>
    )
  }
}
