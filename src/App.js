import React from "react";
import "./App.css";
import { withAuthenticator, AmplifyTheme } from 'aws-amplify-react';

class App extends React.Component {
  state = {};

  render() {
    return <div>App</div>;
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

export default withAuthenticator(App, true, [], null, theme);
