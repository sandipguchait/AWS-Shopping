import React from "react";
import { Menu as Nav, Icon, Button } from "element-react";
import { NavLink } from 'react-router-dom';
import { Auth } from 'aws-amplify';

const Navbar = ({ user }) => {

  const handleSignOut = async() => {
    try {
      await Auth.signOut()
    } catch(err) {
      console.error('Error sigining Out user', err)
    }
  };

  return (
        <Nav mode="horizontal" theme="dark" defaultActive="1">
          <div className="nav-container">
            {/* App Totle / Icon */}
            <Nav.Item index="1">
                <NavLink to="/" className="nav-link">
                  <span className="app-title">
                    <img src="https://icon.now.sh/account_balance/ff0" alt="Logo"
                      className="app-icon"
                    />
                    AWS-MarketPlace
                  </span>
                </NavLink>
            </Nav.Item>

            {/* navBar items  */}
            <div className="nav-items">
              <Nav.Item index="2">
                <span className="app-user">Hello, {user.username} </span>
              </Nav.Item>
              <Nav.Item index="3">
                <NavLink to="/profile" className="nav-link">
                  <Icon name="setting" />
                  Profile
                </NavLink>
              </Nav.Item>
              <Nav.Item index="4">
                <Button type="warning" onClick={handleSignOut}>
                <span className="btn-color">Sign Out</span>
                </Button>
              </Nav.Item>
            </div>
          </div>
        </Nav>
)}

export default Navbar;
