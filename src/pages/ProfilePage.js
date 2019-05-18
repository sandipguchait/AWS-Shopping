import React from "react";
import { API, graphqlOperation } from 'aws-amplify';
// prettier-ignore
// import { Table, Button, Notification, MessageBox, Message, Tabs, Icon, Form, Dialog, Input, Card, Tag } from 'element-react'

const getUser = `query GetUser($id: ID!) {
  getUser(id: $id) {
    id
    username
    email
    registered
    orders {
      items {
        id
        createdAt
        product {
          id
          owner
          price
          createdAt
          description
        }
        shippingAddress {
          city
          country
          address_line1
          address_state
          address_zip
        }
      }
      nextToken
    }
  }
}`


class ProfilePage extends React.Component {
  state = {};

  componentDidMount() {
    if(this.props.user) {
      
    }
  }

  render() {
    return <div>ProfilePage</div>
  }
}

export default ProfilePage;
