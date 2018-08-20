import React from 'react'
import Link from 'next/link'
import Web3Container from '../lib/Web3Container'

import Dropzone from 'react-dropzone'
import axios from 'axios'

import Header from '../components/Header'
import PageWrapper from '../components/PageWrapper'

import keys from '../config/keys'

class NewItem extends React.Component {
  constructor(props) {
    super(props)

    this.addItem = this.addItem.bind(this)
    this.handleDrop = this.handleDrop.bind(this)
  }

  state = {
    storeId: '',
    imageUrl: '',
    title: '',
    description: '',
    price: undefined,
    quantity: undefined
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
        from: accounts[0],
        gas: 4712388,
        gasPrice: 100000000000
      })
  }

  handleDrop = files => {
    // Push all the axios request promise into a single array
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
            imageUrl: fileUrl
          })
        })
    })

    // // Once all the files are uploaded
    // axios.all(uploaders).then(() => {
    //   console.log(data.secur)

    // })
  }

  render() {
    return (
      <PageWrapper>
        <Header />
        <form onSubmit={this.addItem}>
          <p>storeId</p>
          <input
            value={this.state.storeId}
            onChange={event => this.setState({ storeId: event.target.value })}
          />
          {/* <p>imageUrl</p>
          <input
            value={this.state.imageUrl}
            onChange={event => this.setState({ imageUrl: event.target.value })}
          /> */}
          <p>title</p>
          <input
            value={this.state.title}
            onChange={event => this.setState({ title: event.target.value })}
          />
          <p>description</p>
          <input
            value={this.state.description}
            onChange={event =>
              this.setState({ description: event.target.value })
            }
          />
          <p>price</p>
          <input
            value={this.state.price}
            onChange={event => this.setState({ price: event.target.value })}
          />
          <p>quantity</p>
          <input
            value={this.state.quantity}
            onChange={event => this.setState({ quantity: event.target.value })}
          />
          <Dropzone
            onDrop={this.handleDrop}
            multiple
            accept="image/*"
          >
            <p>Drop your files or click here to upload</p>
          </Dropzone>
          <button>Add Item</button>
        </form>
      </PageWrapper>
    )
  }
}

export default () => (
  <Web3Container
    renderLoading={() => <div>Loading Dapp Page...</div>}
    render={({ web3, accounts, contract }) => (
      <NewItem accounts={accounts} contract={contract} web3={web3} />
    )}
  />
)
