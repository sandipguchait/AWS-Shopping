import React from "react";
import { PhotoPicker } from 'aws-amplify-react';
import { Form, Button, Input, Notification, Radio, Progress } from "element-react";

//Helping in Clearing Out Form Inputs
const InitialState = {
    description:'',
    price:'',
    imagePreview: '',
    image: '',
    homedelivery: false
};


class NewProduct extends React.Component {
  state = {...InitialState };

  handleAddProduct = () => {
    console.log(this.state)
    this.setState({...InitialState})
  };

  render() {
    const { description, image, price, homedelivery, imagePreview } = this.state;

    return (
      <div className="flex-center">
        <h2 className="header">Add New Product</h2>
        <div>
          <Form className="market-header">
            <Form.Item label="Add Product Description">
              <Input 
                type="text"
                icon="information"
                placeholder="Description"
                value={description}
                onChange={description => this.setState({ description })}
              />
            </Form.Item>
            <Form.Item label="Set Product Price">
              <Input 
                type="number"
                icon="plus"
                placeholder="Price (INR)"
                value={price}
                onChange={price => this.setState({ price })}
              />
            </Form.Item>
            <Form.Item label="Delivery">
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

            {imagePreview && (
              <img 
                className="image-preview"
                src={imagePreview}
                alt="Product Preview"
              />
            )}
            <PhotoPicker 
              title="Product Image"
              preview="hidden"
              onLoad={url => this.setState({ imagePreview: url })}
              onPick={file => this.setState({ image: file })}
              theme={{
                formContainer: {
                  margin: 0,
                  padding: "0.8em"
                },
                formSection: {
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                },
                sectionBody: {
                  margin: 0,
                  width: "250px"
                },
                sectionHeader: {
                  padding:"0.2em"
                },
                photoPickerButton: {
                  display:"none"
                }
              }}
            />
            <Form.Item>
              <Button
                type="primary"
                disabled={ !image || !description || !price }
                onClick={this.handleAddProduct}
              >
                Add Product
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    )
  }
}

export default NewProduct;
