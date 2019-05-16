import React from "react";
import { API, graphqlOperation } from 'aws-amplify';
import { onCreateProduct, onUpdateProduct, onDeleteProduct } from '../graphql/subscriptions';
import { Loading, Tabs, Icon } from "element-react";
import { Link } from 'react-router-dom';
import NewProduct from '../components/NewProduct';
import Product from '../components/Product';


const getMarket = `query GetMarket($id: ID!) {
  getMarket(id: $id) {
    id
    name
    products {
      items {
        id
        description
        price
        shipped
        owner
        file {
          key
        }
        createdAt
      }
      nextToken
    }
    tags
    owner
    createdAt
  }
}`


class MarketPage extends React.Component {
  state = {
    market: null,
    isLoading: true,
    isMarketOwner: false
  };

  componentDidMount() {
    this.handleGetMarket();
  };

  handleGetMarket = async() => {
    const input = {
      id: this.props.id
    };
    const result = await API.graphql(graphqlOperation(getMarket, input ))
    this.setState({ 
      market: result.data.getMarket,
      isLoading: false
    }, () => this.checkMarketOwner())
  };

  checkMarketOwner = () => {
    const { user } = this.props;
    const { market } = this.state;

    if(user) {
      this.setState({ isMarketOwner: user.username === market.owner })
    }
  };



  render() {
    const { market, isLoading , isMarketOwner } = this.state;

    return isLoading ? (
      <Loading fullscreen={true} />
    ) : (
        <React.Fragment>
          {/* Back Button */}
          <Link to="/" className="link">
            Back to Markets List
          </Link>

          {/* Market MetaData */}
          <span className="items-center pt-2">
            <h2 className="mb-mr">{market.name}</h2>- {market.owner}
          </span>
          <div className="items-center pt-2">
            <span style={{ color: 'var(--lightSquidInk', paddingBottom: '1em'}}>
              <Icon name="date" className="icon" />
              {market.createdAt}
            </span>
          </div>

          {/* New Product Area */}
          <Tabs type="border-card" value={ isMarketOwner ? "1" : "2" }>
            { isMarketOwner && (
              <Tabs.Pane
                label={
                  <>
                    <Icon className="icon" name="plus" />
                    Add Product
                  </>
                }
                name="1"
              >
                <NewProduct id={this.props.id}/>
              </Tabs.Pane>
            )}

            {/* Products List */}
            <Tabs.Pane
              label={
                <>
                  <Icon name="menu" className="icon" />
                  Products ({ market.products.items.length })
                </>
              }
              name="2"
            >
              <div className="product-list">
                {market.products.items.map( product => (
                  <Product product={product} key={product.id}/>
                ))}
              </div>
            </Tabs.Pane>
          </Tabs>
        </React.Fragment>
    )
  }
}

export default MarketPage;
