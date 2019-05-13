import React from "react";
import NewMarket from '../components/NewMarket';
import MarketList from '../components/MarketList';

class HomePage extends React.Component {
  state = {
    searchTerm: '',
    searchResults: [],
    isSearching: false
  };

  handleSearchChange = searchTerm => this.setState({ searchTerm });

  handleClearSearch = () => this.setState({ searchTerm: "", searchResults: "" })

  handleSearch = (event) => {
    event.preventDefault();
    
  }

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
        <MarketList />
      </>
    )
  }
}

export default HomePage;
