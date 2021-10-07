import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Dropdown, Icon, Input, Menu } from 'semantic-ui-react'
import { ComponentProps as Props } from "../../shared/ComponentProps";
import connectAllProps from '../../shared/connect';


interface States {
    activeItem: string
}
class SideBarMenu extends React.Component<Props, States> {
  constructor(props: Props) {
    super(props);
    // this.handleItemClick = this.handleItemClick.bind(this);
  }
  state: States = {
      activeItem: "Dashboard"
  }

  handleItemClick = (e: any, menu: any) => {
    // console.log(this.props);
    this.setState({ activeItem: menu.name });
  }

  render() {
    const { activeItem } = this.state

    return (

      <Menu pointing secondary vertical>
        <Menu.Item
          exact
          name='Dashboard'
          // active={activeItem === 'Dashboard'}
          onClick={this.handleItemClick}
          as={NavLink}
          to="/admin/dashboard"
        />
        <Menu.Item
          name='Teacher'
          // active={activeItem === 'Teacher'}
          onClick={this.handleItemClick}
          as={NavLink}
          to="/admin/dashboard/teacher"
        />
        <Menu.Item
          name='Student'
          // active={activeItem === 'Student'}
          onClick={this.handleItemClick}
          as={NavLink}
          to="/admin/dashboard/student"
        />
        <Menu.Item
          name='Academic'
          // active={activeItem === 'Student'}
          onClick={this.handleItemClick}
          as={NavLink}
          to="/admin/dashboard/student"
        />
        <Menu.Item
          name='Class'
          // active={activeItem === 'Student'}
          onClick={this.handleItemClick}
          as={NavLink}
          to="/admin/dashboard/student"
        />
      </Menu>
    )
  }
}

export default connectAllProps(SideBarMenu);