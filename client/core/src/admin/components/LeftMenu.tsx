
import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Icon } from 'semantic-ui-react';
import { SemanticICONS } from 'semantic-ui-react/dist/commonjs/generic';
import '../css/LeftMenu.css';

interface States {};
interface SubMenuProps {
    submenu: any,
    menu: any
}
class SubMenu extends Component<SubMenuProps, States> {
    constructor(props: SubMenuProps) {
        super(props)
    }
  render() {
    let subMenu = this.props.submenu;

    if (subMenu !== null) {
      return (
        <div>
          {subMenu.map((submenu: any) => {
            return (
              <div key={submenu.name} className="sub-menu">
                <Link to={submenu.to}>
                  <Icon name="plus" size="small"/>
                  <span>{submenu.name}</span>
                </Link>
              </div>
            );
          })}
        </div>
      );
    } else {
      return <div></div>
    }
  }
}

interface States {
    activeMenu: string
};

interface Props {}

class LeftMenu extends Component<Props, States> {
  constructor(props: Readonly<{}>) {
    super(props);
    this.state = {
      activeMenu: 'dashboard'
    };
  }

  render() {
    const menus = [
      {
        name: 'dashboard',
        icon: 'inbox',
        to: 'dashboard'
      },
      {
        name: 'Student',
        icon: 'checkmark box',
        submenus: [
          { name: 'input', to: 'dashboard/student' },
          { name: 'range-picker', to: 'dashboard/student'}
        ]
      },
      {
        name: 'Teacher',
        icon: 'sitemap',
        to: 'dashboard/teacher'
      },
      {
        name: 'Administrative',
        icon: 'calendar check',
        to: 'dashboard/administrative'
      },
      {
        name: 'layout',
        icon: 'grid layout',
        to: 'dashboard/administrative'
      },
      {
        name: 'chart',
        icon: 'bar chart',
        to: 'dashboard/administrative'
      }
    ];

    return (
      <div>
        <div className="left-menus">
          {menus.map(item => {
            if (item.submenus) {
              return (
                <div key={item.name}
                  className={this.state.activeMenu === item.name ? 'menu active' : 'menu' }
                  onClick={() => this.setState({ activeMenu: item.name })}>
                    <Icon name={ item.icon as SemanticICONS} size="large"/>
                    <span>{item.name}</span>
                    <Icon name={this.state.activeMenu === item.name ? "angle up" : "angle down" }/>
                  <div className="">
                    <div className={ 'sub-menu-container ' +
                        (this.state.activeMenu === item.name ? 'active' : '') } >
                      <SubMenu submenu={item.submenus} menu={item} />
                    </div>
                  </div>
                </div>
              )
            } else {
              return (
                <NavLink to={item.to}  key={item.name}
                  className={this.state.activeMenu === item.name ? 'menu active' : 'menu' }
                  onClick={() => this.setState({ activeMenu: item.name })}
                  >
                  <Icon name={item.icon as SemanticICONS} size="large"/>
                  <span>{item.name}</span>
                </NavLink>
              )
            }
          })}
        </div>
      </div>
    );
  }
}

export default LeftMenu;