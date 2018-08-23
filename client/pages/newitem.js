import React from 'react'
import Link from 'next/link'
import Router, { withRouter } from 'next/router'
import Web3Container from '../lib/Web3Container'

import styled from 'styled-components'
import Dropzone from 'react-dropzone'
import axios from 'axios'

import Header from '../components/Header'
import PageWrapper from '../components/PageWrapper'

import keys from '../config/keys'

const dropzoneStyle = {
  cursor: 'pointer',
  maxWidth: '200px',
  background: '#F0F1F5',
  padding: '20px',
  border: '#DBDBDE solid 2px',
}

const ImageUploadWrapper = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  margin: 20px 0;
  max-width: 500px;
`

const UploadedImage = styled.div`
  max-height: 100px
`

const NewItemButton = styled.button `
  background: #56C99D;
  color: white;
  padding: 15px 40px;
  border: 0px;
  border-radius: 3px;
  cursor: pointer;
  margin: 50px auto;
`

class NewItem extends React.Component {
  constructor(props) {
    super(props)

    this.addItem = this.addItem.bind(this)
    this.handleDrop = this.handleDrop.bind(this)
  }

  state = {
    storeId: this.props.routers.query.id,
    imageUrl: '',
    title: '',
    description: '',
    price: undefined,
    quantity: undefined,
    isLoading: false
  }

  async addItem(event) {
    event.preventDefault()

    console.log(this.state)

    const { accounts, contract } = this.props
    const {
      storeId,
      imageUrl,
      title,
      description,
      price,
      quantity
    } = this.state
    await contract.methods
      .addItem(
        storeId,
        imageUrl,
        title,
        description,
        window.web3.toWei(price, 'ether'),
        quantity
      )
      .send({
        from: accounts[s0],
        gas: 4000000,
        gasPrice: 4000000000
      })

    Router.push(`/store/${this.props.routers.query.id}`)
  }

  handleDrop = files => {
    // Push all the axios request promise into a single array
    this.setState({
      isLoading: true
    })
    const uploaders = files.map(file => {
      // Initial FormData
      const formData = new FormData()
      formData.append('file', file)
      formData.append('tags', `codeinfuse, medium, gist`)
      formData.append('upload_preset', keys.cloudinaryPreset) // Replace the preset name with your own
      formData.append('api_key', keys.cloudinaryKey) // Replace API key with your own Cloudinary key
      formData.append('timestamp', (Date.now() / 1000) | 0)

      // Make an AJAX upload request using Axios (replace Cloudinary URL below with your own)
      return axios
        .post(
          'https://api.cloudinary.com/v1_1/dte4ckqx1/image/upload',
          formData,
          {
            headers: { 'X-Requested-With': 'XMLHttpRequest' }
          }
        )
        .then(response => {
          const data = response.data
          const fileUrl = data.secure_url // You should store this URL for future references in your app
          console.log(fileUrl)
          this.setState({
            imageUrl: fileUrl,
            isLoading: false
          })
        })
    })
  }

  render() {
    console.log(this.state)

    let button
    if (this.state.isLoading == true) {
      button = <p>Uploading image...</p>
    } else {
      button = <NewItemButton>Add Item</NewItemButton>
    }

    return (
      <PageWrapper>
        <Header />
        <form onSubmit={this.addItem}>
          {/* <p>storeId</p>
          <input
            value={this.state.storeId}
            onChange={event => this.setState({ storeId: event.target.value })}
          /> */}
          {/* <p>imageUrl</p>
          <input
            value={this.state.imageUrl}
            onChange={event => this.setState({ imageUrl: event.target.value })}
          /> */}
          <p>Item Name</p>
          <input
            value={this.state.title}
            onChange={event => this.setState({ title: event.target.value })}
          />
          <p>Item Description</p>
          <input
            value={this.state.description}
            onChange={event =>
              this.setState({ description: event.target.value })
            }
          />
          <p>Item Price</p>
          <input
            value={this.state.price}
            onChange={event => this.setState({ price: event.target.value })}
          />
          <p>Item Quantity</p>
          <input
            value={this.state.quantity}
            onChange={event => this.setState({ quantity: event.target.value })}
          />
          <p>Upload Image</p>
          <ImageUploadWrapper>
          <Dropzone
            onDrop={this.handleDrop}
            style={dropzoneStyle}
            accept="image/*"
          >
            <p>Drop your files or click here to upload</p>
          </Dropzone>
          <UploadedImage><img src={this.state.imageUrl} /></UploadedImage>
          </ImageUploadWrapper>
          {button}
        </form>
      </PageWrapper>
    )
  }
}

class NewItemPage extends React.Component {
  render() {
    return (
      <Web3Container
        renderLoading={() => <PageWrapper><p>Loading Dapp Page...</p></PageWrapper>}
        render={({ web3, accounts, contract }) => (
          <NewItem
            accounts={accounts}
            contract={contract}
            web3={web3}
            routers={this.props.router}
          />
        )}
      />
    )
  }
}

export default withRouter(NewItemPage)
