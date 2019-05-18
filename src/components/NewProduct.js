import React from "react";
import { PhotoPicker } from 'aws-amplify-react';
import { Storage, Auth , API, graphqlOperation } from 'aws-amplify';
import aws_exports from '../aws-exports';
import { createProduct } from '../graphql/mutations';
import { convertDollarsToCents } from '../utils/index';

import { Form, Button, Input, Notification, Radio, Progress } from "element-react";

//Helping in Clearing Out Form Inputs
const InitialState = {
    description:'',
    price:'',
    imagePreview: '',
    image: '',
    homedelivery: false,
    isUploading: false,
    percentUploaded: 0
};


class NewProduct extends React.Component {
  state = {...InitialState };


  //Creating Product
  handleAddProduct = async() => {
    try{
      this.setState({ isUploading: true })
      const visibility = "public";
      const { identityId } = await Auth.currentCredentials();
      const filepath = `/${visibility}/${identityId}/${Date.now()}-${this.state.image.name}`;
  
      const uploadedFile = await Storage.put(filepath, this.state.image.file, {
        contentType: this.state.image.type,
        progressCallback: progress => {
          console.log(`Uploaded: ${ progress.loaded}/${progress.total}`);
          const percentUploaded = Math.round((progress.loaded / progress.total ) * 100)
          this.setState({ percentUploaded })
        }
      });
      const file = {
        key: uploadedFile.key,
        bucket: aws_exports.aws_user_files_s3_bucket,
        region: aws_exports.aws_project_region
      };
      const input = {
        productMarketId: this.props.id,
        description: this.state.description,
        price: convertDollarsToCents(this.state.price),
        shipped: this.state.homedelivery,
        file
      };
      const result = await API.graphql(graphqlOperation(createProduct,{ input }))
      console.log('from newproduct',result)
      Notification({
        title: "Success",
        message: " Product successfully created",
        type: "success"
      })
      this.setState({...InitialState})
    }
    catch (err) {
      console.error('Error from newproduct', err)
      Notification.error({
        title: "error",
        message: " Error Creating Product",
        type:"error"
      })
    }
  };

  render() {
    const { description, image, price, homedelivery, imagePreview, isUploading, percentUploaded } = this.state;

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
                placeholder="Price (USD)"
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
            {percentUploaded > 0 && (
              <Progress
                type="circle"
                status="success"
                className="progress"
                percentage={percentUploaded}
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
                disabled={ !image || !description || !price || isUploading }
                onClick={this.handleAddProduct}
                loading={isUploading}
              >
                {isUploading ? "Uploading..." : "Add Product"}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    )
  }
}

export default NewProduct;
