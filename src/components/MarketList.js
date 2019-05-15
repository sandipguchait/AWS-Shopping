import React from "react";
import { graphqlOperation } from 'aws-amplify';
import { Connect } from 'aws-amplify-react';
import { listMarkets } from '../graphql/queries';
import { onCreateMarket } from '../graphql/subscriptions';
import { Loading, Card, Icon, Tag } from "element-react";
import { Link } from 'react-router-dom';
//components
import Errors from './Error';


const MarketList = ({ searchResults, searchTerm }) => {

  const onNewmarket = ( prevQuery, newdata ) => {
    let updatedQuery = {...prevQuery};
    const updatedMarketList = [
      newdata.onCreateMarket,
      ...prevQuery.listMarkets.items
    ]
    updatedQuery.listMarkets.items = updatedMarketList;
    return updatedQuery;
  }

  return (
    <Connect
      query={graphqlOperation(listMarkets)}
      subscription={graphqlOperation(onCreateMarket)}
      onSubscriptionMsg={onNewmarket}
    >
      {({ data, loading , errors }) => {
        if(errors.length > 0) return <Errors errors={errors}/>
        if(loading || !data.listMarkets ) return <Loading fullscreen={true} />
        const markets = searchResults.length > 0 ? searchResults : data.listMarkets.items;
        const searchmarkets = (searchTerm === '') ? data.listMarkets.items : markets ;


        return (
          <>
            { (searchResults.length > 0 && searchTerm !== '') ? (
              <h2 className="text-green">
                <Icon type="success" name="check" className="icon" />
                { searchResults.length } Results
              </h2>
            ) :  
            (<h2 className="header">
              <img src="https://icon.now.sh/store_mall_directory/527FFF" alt="Store Icon" className="large-icon"/>
              Markets
            </h2>
            )}
            {searchmarkets.map( market => (
              <div key={market.id} className="my-2">
                <Card 
                  bodyStyle={{
                    padding:"0.7em",
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <span className="flex">
                      <Link className="link" to={`/markets/${market.id}`}>
                        {market.name}
                      </Link>
                      <span style={{ color: "var(--darkAmazonOrange)"}}>
                        { market.products.items && market.products.items.length }
                      </span>
                        <img src="https://icon.now.sh/shopping_cart/f60" alt="shopping cart"/>
                    </span>
                    <div style={{ color: "var(--lightSquidink"}}>
                        {market.owner}
                    </div>
                    </div>
                    <div>
                      {market.tags && market.tags.map(tag => (
                          <Tag key={tag} type="danger" className="mx-1">
                            {tag}
                          </Tag>
                      ))}
                    </div>
                </Card>
              </div>
            ))}
          </>
        )
      }}
    </Connect>
  )
};

export default MarketList;
