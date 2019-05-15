import React from "react";
import NewMarket from '../components/NewMarket';
import MarketList from '../components/MarketList';
import { searchMarkets } from '../graphql/queries';
import { API, graphqlOperation } from 'aws-amplify';

class HomePage extends React.Component {
  state = {
    searchTerm: '',
    searchResults: [],
    isSearching: false
  };

  handleSearchChange = searchTerm => this.setState({ searchTerm });

  handleClearSearch = () => this.setState({ searchTerm: "", searchResults: "" })

  // Search Function Using AWS Elastic Search
  handleSearch = async (event) => {
    try{
      event.preventDefault();
      this.setState({ isSearching: true })
      const result = await API.graphql(graphqlOperation(searchMarkets, {
        filter: {
          or: [
            { name: { match: this.state.searchTerm }},
            { owner : { match: this.state.searchTerm }},
            { tags : { match: this.state.searchTerm }}
          ]
        }, 
        sort: {
          field: "createdAt",
          direction: "desc"
        }
      }));
      this.setState({ 
        searchResults: result.data.searchMarkets.items,
        isSearching: false
      })
    } 
    catch(err) {
      console.error(err);
    }
    
  };



  render() {
    return (
      <>
        <NewMarket 
          searchTerm={this.state.searchTerm}
          isSearching={this.isSearching}
          handleSearchChange={this.handleSearchChange}
          handleClearSearch={this.handleClearSearch}
          handleSearch={this.handleSearch}
        />
        <MarketList  searchResults={this.state.searchResults} searchTerm={this.state.searchTerm} />
      </>
    )
  }
}

export default HomePage;
