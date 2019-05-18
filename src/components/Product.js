import React from "react";
import { Notification, Popover, Button, Dialog, Card, Form, Input, Radio } from "element-react";
import { S3Image } from 'aws-amplify-react';
import { API, graphqlOperation } from 'aws-amplify';
import { convertCentsToDollars, convertDollarsToCents } from '../utils/index';
import { UserContext } from '../App';
import PayButton from './PayButton';
import { updateProduct, deleteProduct } from '../graphql/mutations';


class Product extends React.Component {
  state = {
    updateProductDialog: false,
    deleteProductDialog: false,
    description:'',
    price:'',
    homedelivery: false
  };


  // UPDATE PRODUCT MUTATION
  handleUpdateProduct = async productId => {
    try{
      this.setState({ updateProductDialog: false })
      const { description, price, homedelivery } = this.state;
      const input = {
        id: productId,
        description,
        price: convertDollarsToCents(price),
        shipped: homedelivery
      }

      const result = await API.graphql(graphqlOperation( updateProduct, { input: input }));
      console.log(" updated ",{result})
      Notification({
        title: "Success",
        message: " Product successfully updated",
        type:"success"
      })
    } catch(err) {
      console.error(err)
      Notification.error({
        title: "error",
        message: " Error Updating Product",
        type:"error"
      })
    }
  };


  // DELETE PRODUCT MUTATION 
  handleDeleteProduct = async productId => {
    try{
      this.setState({ deleteProductDialog: false })
      const input = {
        id: productId
      }
      await API.graphql(graphqlOperation( deleteProduct, { input: input  }));
      Notification({
        title: "Success",
        message: " Product Deleted",
        type:"success"
      })
    }
    catch(err) {
      console.err(err)
      Notification.error({
        title: "error",
        message: " Error Deleting Product",
        type:"error"
      })
    }
  }
  
  render() {
    const { updateProductDialog,deleteProductDialog, description, price, homedelivery } = this.state;
    const { product } = this.props;

    return (
      <UserContext.Consumer>
        {({ user }) => {
          const isProductOwner = user && user.attributes.sub === product.owner;
          return (
            <div className="card-container">
              <Card bodyStyle={{ padding: 0, minWidth: '200px'}}>
                <S3Image 
                  imgKey={product.file.key} 
                  theme={{
                    photoImg: { maxWidth: '100%', maxHeight: '100%'}
                  }}
                />
                <div className="card-body">
                  <h3 className="m-0">{product.description}</h3>
                  <div className="items-center">
                    <img
                      src={`https://icon.now.sh/${product.shipped ? "markunread_mailbox" : "mail"}`} 
                      alt="Shipping"
                      className="icon"
                    />
                    { product.shipped ? "Home Delivery" : "Email"}
                  </div>
                  <div className="text-right">
                    <span className="mx-1">
                      ${convertCentsToDollars(product.price)}
                    </span>
                    {!isProductOwner && (
                        <PayButton product={product} user={user} />
                    )}
                  </div>
                </div>
              </Card>
              {/* Update and Delete Product Buttons */}
              <div className="text-center">
                  {isProductOwner && (
                    <>
                      <Button 
                        type="warning"
                        icon="edit"
                        className="m-1"
                        onClick={() => this.setState({ 
                          updateProductDialog: true,
                          description: product.description,
                          price: convertCentsToDollars(product.price),
                          homedelivery: product.shipped
                        })}
                      />
                      <Popover
                        placement="top"
                        width="160"
                        trigger="click"
                        visible={deleteProductDialog}
                        content={
                          <>
                            <p>Do you Want to delete this?</p>
                            <div className="text-right">
                              <Button
                                size="mini"
                                type="text"
                                className="m-1"
                                onClick={() => this.setState({ deleteProductDialog: false })}
                              >
                                Cancel
                              </Button>
                              <Button
                                type="primary"
                                size="mini"
                                className="m-1"
                                onClick={() => this.handleDeleteProduct(product.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </>
                        }
                      >
                        <Button 
                          onClick={() => this.setState({ deleteProductDialog: true })}
                          type="danger"
                          icon="delete"
                        />
                      </Popover>
                    </>
                  )}
              </div>

              {/* Update Product Dialog */}
              <Dialog
                title="Update product"
                size="large"
                customClass="dialog"
                visible={updateProductDialog}
                onCancel={() => this.setState({ 
                  updateProductDialog: false,
                })}
              >
                <Dialog.Body>
                  <Form labelPosition="top">
                     <Form.Item label="Update Product Description">
                        <Input 
                          icon="information"
                          placeholder="Product Description"
                          value={description}
                          trim={true}
                          onChange={description => this.setState({ description })}
                        />
                      </Form.Item>
                      <Form.Item label="Update Product Price">
                        <Input 
                          type="number"
                          icon="plus"
                          placeholder="Price (USD)"
                          value={price}
                          onChange={price => this.setState({ price })}
                        />
                      </Form.Item>
                      <Form.Item label="Update Shipping">
                        <div className="text-center">
                          <Radio
                            value="true"
                            checked={ homedelivery === true }
                            onChange={ ()=> this.setState({ homedelivery: true })}
                          >
                            Home-Delivery
                          </Radio>
                          <Radio
                            value="false"
                            checked={ homedelivery === false }
                            onChange={ ()=> this.setState({ homedelivery: false })}
                          >
                            Emailed
                          </Radio>
                        </div>
                      </Form.Item>
                  </Form>
                </Dialog.Body>
                <Dialog.Footer>
                  <Button
                    onClick={() => this.setState({ updateProductDialog: false })}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="primary"
                    onClick={() => this.handleUpdateProduct(product.id)}
                  >
                    Update
                  </Button>
                </Dialog.Footer>
              </Dialog>
            </div>
          )
        }}
      </UserContext.Consumer>
    )
  }
}

export default Product;
