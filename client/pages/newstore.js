import React from 'react'
import Router from 'next/router'
import Web3Container from '../lib/Web3Container'
import ipfs from '../lib/ipfs'

import Dropzone from 'react-dropzone'
import styled from 'styled-components'
import axios from 'axios'

import keys from '../config/keys'

import Header from '../components/Header'
import PageWrapper from '../components/PageWrapper'

const dropzoneStyle = {
  cursor: "pointer",
  maxWidth: "200px",
  maxHeight: "100px",
  background: "#F0F1F5",
  padding: "20px",
  border: "#DBDBDE solid 2px",
  display: "block"
}

const NewStoreButton = styled.button `
  background: #56C99D;
  color: white;
  padding: 15px 40px;
  border: 0px;
  border-radius: 3px;
  cursor: pointer;
  margin: 50px auto;
`

const ImageUploadWrapper = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  margin: 20px 0;
  max-width: 30px;
`

const UploadedImage = styled.div`
  max-height: 100px
`

class NewStore extends React.Component {
  constructor(props) {
    super(props)

    this.addStore = this.addStore.bind(this)
    this.captureFile = this.captureFile.bind(this)
  }

  state = {
    imageUrl: undefined,
    title: undefined,
    description: undefined,
    isLoading: false,
    ipfsHash: '',
    buffer: null
  }

  async addStore(event) {
    event.preventDefault()

    const { accounts, contract } = this.props
    const { imageUrl, title, description } = this.state
    await contract.methods.addStore(imageUrl, title, description).send({
      from: accounts[0],
      gas: 4000000,
      gasPrice: 4000000000
    })

    Router.push(`/indexstore`)
  }

  captureFile(event) {
    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      this.setState({ isLoading: true })
      this.setState({ buffer: Buffer(reader.result) }, () => {

        console.log('buffer', this.state.buffer)
        ipfs.files.add(this.state.buffer, (error, result) => {
          if(error) {
            console.error(error)
            return
          }
          this.setState({ ipfsHash: result[0].hash }, () => {
            this.setState({ imageUrl: `https://ipfs.io/ipfs/${this.state.ipfsHash}`})
            this.setState({ isLoading: false })
            console.log('ifpsHash', this.state.ipfsHash)
          })
          })
      })
    }



  }
  // handleDrop = files => {

  //   this.setState ({
  //     isLoading: true
  //   })
  //   // Push all the axios request promise into a single array
  //   const uploaders = files.map(file => {

  //     const formData = new FormData()
  //     formData.append('file', file)
  //     formData.append('tags', `codeinfuse, medium, gist`)
  //     formData.append('upload_preset', keys.cloudinaryPreset) // Replace the preset name with your own
  //     formData.append('api_key', keys.cloudinaryKey) // Replace API key with your own Cloudinary key
  //     formData.append('timestamp', (Date.now() / 1000) | 0)

  //     // Make an AJAX upload request using Axios (replace Cloudinary URL below with your own)
  //     return axios
  //       .post(
  //         'https://api.cloudinary.com/v1_1/dte4ckqx1/image/upload',
  //         formData,
  //         {
  //           headers: { 'X-Requested-With': 'XMLHttpRequest' }
  //         }
  //       )
  //       .then(response => {
  //         const data = response.data
  //         const fileUrl = data.secure_url // You should store this URL for future references in your app
  //         console.log(fileUrl)
  //         this.setState({
  //           imageUrl: fileUrl,
  //           isLoading: false
  //         })
  //       })
  //   })
  // }



  render() {
    let button
    if (this.state.isLoading == true) {
      button = <p>Uploading image to IPFS...</p>
    } else {
      button = <NewStoreButton>Add Store</NewStoreButton>
    }
    
    return (
      <PageWrapper>
        <Header />
        <h2>Add New Store</h2>
        {/* <Header accounts = {this.props.accounts}/> */}
        <form onSubmit={this.addStore}>
          {/* <p>imageUrl</p>
          <input
            value={this.state.imageUrl}
            onChange={event => this.setState({ imageUrl: event.target.value })}
          /> */}
          <p>Store Name</p>
          <input
            value={this.state.title}
            onChange={event => this.setState({ title: event.target.value })}
          />
          <p>Store Description</p>
          <input
            value={this.state.description}
            onChange={event =>
              this.setState({ description: event.target.value })
            }
          />
          <p>Upload Store Image</p>
          <ImageUploadWrapper>

            <input type='file' onChange={this.captureFile} />
          {/* <div><Dropzone
            onDrop={this.handleDrop}
            style={dropzoneStyle}
            accept="image/*"
          >
            <p>Drop your files or click here to upload</p>
          </Dropzone></div> */}
          <img src = {this.state.imageUrl}/>
          </ImageUploadWrapper>
          {button}
        </form>

      </PageWrapper>
    )
  }
}

export default () => (
  <Web3Container
    renderLoading={() => <PageWrapper><p>Loading Dapp Page...</p></PageWrapper>}
    render={({ web3, accounts, contract }) => (
      <NewStore accounts={accounts} contract={contract} web3={web3} />
    )}
  />
)
