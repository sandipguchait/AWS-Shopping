import React from "react";
import { API, graphqlOperation } from 'aws-amplify';
import { createMarket } from '../graphql/mutations';
import { Form, Button, Dialog, Input, Select, Notification } from 'element-react';
import { UserContext } from '../App';
import '../App.css';

class NewMarket extends React.Component {
  state = {
    name: '',
    tags: ["Arts", "Technology", "Entertainment", "Education", "Music"],
    selectedTags: [],
    options: [],
    addMarketDialog: false,
  };

  // Adding New Market data to AWS Database
  handleAddmarket = async ( user ) => {
    try {
      this.setState({ addMarketDialog: false })
      const input = {
        name: this.state.name,
        owner: user.username,
        tags: this.state.selectedTags
      };
      const result = await API.graphql(graphqlOperation(createMarket, { input: input }))
      console.info(`Created market: id ${result.data.createMarket.id}`)
      this.setState({ name: "", selectedTags: [] })
    } catch(err) {
        console.error('Error adding Market', err )
        Notification.error({
          title: "Error",
          message: `${err.message || "Error adding market"}`
        })
    }
  };

  // Filtering Tags function 
  handleFilterTags = (query) => {
   const options = this.state.tags
      .map(tag => ({ value: tag, label: tag }))
      .filter(tag => tag.label.toLowerCase().includes(query.toLowerCase()))
    this.setState({ options })
  };

  render() {
    return (
      <UserContext.Consumer>

        {({ user }) => <React.Fragment>
          <div className="market-header">
            <h1 className="market-title">
              Create Your <strong className="spacing">Market</strong>
              <Button type="text" icon="plus" className="market-title-button" 
                onClick={()=> this.setState({ addMarketDialog: true })}
              />
            </h1>       

          {/* search Market Feature  */}
            <Form inline={true} onSubmit={this.props.handleSearch}>
              <Form.Item>
                <Input
                  className="inputmobile"
                  value={this.props.searchTerm}
                  onChange={this.props.handleSearchChange}
                  placeholder="Search Markets.."
                  />
              </Form.Item>
              <Form.Item>
                <Button
                  type="info"
                  className="buttonmobile"
                  icon="search"
                  onClick={this.props.handleSearch}
                  loading={this.props.isSearching}
                  >
                  Search
                </Button>
              </Form.Item>
              <Form.Item>
                <Button
                  className="buttonmobile"
                  type="danger"
                  icon="circle-close"
                  onClick={this.props.handleClearSearch}
                  >
                  Clear
                </Button>
              </Form.Item>
            </Form>
          </div>


          {/* CREATE MARKET FEATURE  */}
          <Dialog
            title="Create New Market"
            visible={this.state.addMarketDialog}
            onCancel={() => this.setState({ addMarketDialog: false })}
            size="large"
            customClass="dialog"
          >
            <Dialog.Body>
              <Form labelPosition="top">
                <Form.Item label="Add Market Name">
                  <Input 
                      placeholder="Market Name"
                      trim={true}
                      value={this.state.name}
                      onChange={name => this.setState({ name })}
                  />
                </Form.Item>
                <Form.Item label=" Add Tags">
                  <Select 
                    multiple={true}
                    filterable={true}
                    placeholder="Market Tags"
                    onChange={selectedTags => this.setState({ selectedTags})}
                    remoteMethod={this.handleFilterTags}
                    remote={true}
                  >
                  {this.state.options.map( option => (
                    <Select.Option 
                        key={option.value}
                        label={option.label}
                        value={option.value}
                    />
                  ))}
                  </Select>
                </Form.Item>
              </Form>
            </Dialog.Body>
            <Dialog.Footer>
              <Button onClick={() => this.setState({ addMarketDialog: false })}>
                Cancel
              </Button>
              <Button
                type="primary"
                disabled={!this.state.name}
                onClick={() => this.handleAddmarket(user)}
              >
                Add
              </Button>
            </Dialog.Footer>
          </Dialog>
        </React.Fragment>}
      </UserContext.Consumer>
    )
  }
}

export default NewMarket;
