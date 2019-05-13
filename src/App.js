import React from "react";
import "./App.css";
import { Auth, Hub } from 'aws-amplify';
import { Authenticator, AmplifyTheme } from 'aws-amplify-react';

class App extends React.Component {
  state = {
    user: null
  };

  // Check user logged In or not when component mounts
  componentDidMount() {
    this.getuserData();
    Hub.listen('auth', this, 'onHubCapsule')
  };

  getuserData = async () => {
    const user = await Auth.currentAuthenticatedUser()
    user ? this.setState({ user }) : this.setState({ user: null })
  };

  // Keep track of user state if they click login or logout
  onHubCapsule = capsule => {
    switch(capsule.payload.event) {
      case "signIn":
        console.log('signed In')
        this.getuserData()
        break;
      case "signUp":
        console.log('sign up')
        break;
      case "signOut":
        console.log('sign out')
        this.setState({ user: null })
        break;
      default:
       return;
    }
  }

  render() {
    const { user } = this.state;

    return !user ? (
      <Authenticator  theme={theme}/> 
    ) : <div>App</div>
  }
}

const theme = {
  ...AmplifyTheme,
  navBar: {
    ...AmplifyTheme.navBar,
    backgroundColor: "lightblue"
  },
  navItem: {
    ...AmplifyTheme.navItem,
    fontSize: "15px",
    fontWeight: "normal",
    fontFamily: "Montserrat",
    fontStyle: "italic"
  },
  button: {
    ...AmplifyTheme.button,
    backgroundColor: "var(--lightAmazonOrange)"
  },
  sectionBody: {
    ...AmplifyTheme.sectionBody,
    padding: "5px"
  },
  sectionHeader: {
    ...AmplifyTheme.sectionHeader,
    backgroundColor: "var(--squidInk)"
  },
  inputLabel: {
    ...AmplifyTheme.inputLabel,
    fontSize: "15px",
    fontWeight: "bold",
    fontFamily: "Montserrat",
    fontStyle: "normal"
  }
};

// export default withAuthenticator(App, true, [], null, theme);
export default App;