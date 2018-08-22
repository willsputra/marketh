import React from 'react'
import Link from 'next/link'
import Web3Container from '../lib/Web3Container'

import Dropzone from 'react-dropzone'
import styled from 'styled-components'
import axios from 'axios'

import keys from '../config/keys'

import Header from '../components/Header'
import PageWrapper from '../components/PageWrapper'

const dropzoneStyle = {
  cursor: "pointer",
  maxWidth: "200px",
  background: "#F0F1F5",
  padding: "20px",
  border: "#DBDBDE solid 2px",
  margin: "20px 0px"
}

class NewStore extends React.Component {
  constructor(props) {
    super(props)

    this.addStore = this.addStore.bind(this)
  }

  state = {
    imageUrl: undefined,
    title: undefined,
    description: undefined
  }

  async addStore(event) {
    event.preventDefault()

    const { accounts, contract } = this.props
    const { imageUrl, title, description } = this.state
    await contract.methods.addStore(imageUrl, title, description).send({
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

  }

  render() {
    return (
      <PageWrapper>
        <Header />
        {/* <Header accounts = {this.props.accounts}/> */}
        <form onSubmit={this.addStore}>
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
          <Dropzone
            onDrop={this.handleDrop}
            style={dropzoneStyle}
            accept="image/*"
          >
            <p>Drop your files or click here to upload</p>
          </Dropzone>
          <img src = {this.state.imageUrl} />

          <button>Add Store</button>
        </form>
      </PageWrapper>
    )
  }
}

export default () => (
  <Web3Container
    renderLoading={() => <div>Loading Dapp Page...</div>}
    render={({ web3, accounts, contract }) => (
      <NewStore accounts={accounts} contract={contract} web3={web3} />
    )}
  />
)
