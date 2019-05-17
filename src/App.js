import React from "react";
import "./App.css";
import { API,graphqlOperation ,Auth, Hub } from 'aws-amplify';
import { Authenticator, AmplifyTheme } from 'aws-amplify-react';
import { BrowserRouter, Route } from 'react-router-dom';
import  { getUser } from './graphql/queries';

// Components
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import MarketPage from "./pages/MarketPage";
import NavBar from './components/Navbar';
import { registerUser } from "./graphql/mutations";

export const UserContext = React.createContext();

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
        this.getuserData();
        this.registerNewUser(capsule.payload.data)
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
  };

  registerNewUser = async signInData => {
    const getUserInput = {
      id: signInData.signInUserSession.idToken.payload.sub
    }
    const { data } = await API.graphql(graphqlOperation( getUser, getUserInput ));
    
    //if there is no user or user hastneen registered before
    if(!data.getUser) {
      try {
        const registerUserInput = {
          ...getUserInput,
          username: signInData.username,
          email: signInData.signInUserSession.idToken.payload.email,
          registered: true
        }
        const newUser = await API.graphql(graphqlOperation( registerUser, { input: registerUserInput }));
        console.log(newUser)

      } catch(err) {
        console.error("Error registering new user", err);
      }
    }
  }

  render() {
    const { user } = this.state;

    return !user ? (
      <Authenticator  theme={theme}/> 
    ) : (
      <UserContext.Provider value={{ user }}>
        <BrowserRouter>
          <React.Fragment>
            {/* Navbar */}
            <NavBar user={user}/>
            {/* Routes */}
            <div className="app-container">
              <Route exact path="/" component={HomePage} />
              <Route path="/profile" component={ProfilePage} />
              <Route path="/markets/:id" 
                  component={({ match }) => <MarketPage user={user} id={match.params.id} />} 
              />
            </div>
          </React.Fragment>
        </BrowserRouter>
      </UserContext.Provider>
    )
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