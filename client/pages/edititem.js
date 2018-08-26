import React from 'react'
import Router, { withRouter } from 'next/router'
import Web3Container from '../lib/Web3Container'
import ipfs from '../lib/ipfs'
import Link from 'next/link'

import styled from 'styled-components'

import Header from '../components/Header'
import PageWrapper from '../components/PageWrapper'
import Button from '../components/Button'

const ImageUploadWrapper = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  margin: 20px 0;
  max-width: 500px;
`

class NewItem extends React.Component {
  constructor(props) {
    super(props)

    this.editItem = this.editItem.bind(this)
    this.captureFile = this.captureFile.bind(this)
  }

  async componentDidMount() {
    const { contract, accounts } = this.props
    const itemsCount = await contract.methods.itemsCount().call()

    const items = await Promise.all(
      Array(parseInt(itemsCount))
        .fill()
        .map((element, index) => {
          return contract.methods.items(index).call()
        })
    )

    const toEdit = items[this.props.routers.query.itemId]

    this.setState({
      title: toEdit.title,
      description: toEdit.description,
      price: window.web3.fromWei(toEdit.price),
      quantity: toEdit.quantity,
      imageUrl: toEdit.imageUrl
    })
  }

  state = {
    itemId: this.props.routers.query.itemId,
    imageUrl: undefined,
    title: '',
    description: '',
    price: undefined,
    quantity: undefined,
    isLoading: false,
    ipfsHash: '',
    buffer: null
  }

  async editItem(event) {
    event.preventDefault()

    const { accounts, contract } = this.props
    const { itemId, imageUrl, title, description, price, quantity } = this.state

    try {
      await contract.methods
        .editItem(
          itemId,
          imageUrl,
          title,
          description,
          window.web3.toWei(price, 'ether'),
          quantity
        )
        .send({
          from: accounts[0],
          gas: 4000000,
          gasPrice: 4000000000
        })

      Router.push(`/store/${this.props.routers.query.storeId}`)
    } catch (error) {
      alert(error)
    }
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
          if (error) {
            console.error(error)
            return
          }
          this.setState({ ipfsHash: result[0].hash }, () => {
            this.setState({
              imageUrl: `https://ipfs.io/ipfs/${this.state.ipfsHash}`
            })
            this.setState({ isLoading: false })
            console.log('ipfsHash', this.state.ipfsHash)
          })
        })
      })
    }
  }

  // handleDrop = files => {
  //   // Push all the axios request promise into a single array
  //   this.setState({
  //     isLoading: true
  //   })
  //   const uploaders = files.map(file => {
  //     // Initial FormData
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
    console.log(this.state)

    let button
    if (this.state.isLoading == true) {
      button = <p>Uploading image...</p>
    } else {
      button = <Button>Save</Button>
    }

    return (
      <PageWrapper>
        <Header />
        <Link href={{ pathname: `/store/${this.props.routers.query.storeId}` }}>
          <a>
            <p style={{ color: '#56C99D' }}>{'<'} Back to Store</p>
          </a>
        </Link>
        <form onSubmit={this.editItem}>
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
            <input type="file" onChange={this.captureFile} />

            {/* <Dropzone
            onDrop={this.handleDrop}
            style={dropzoneStyle}
            accept="image/*"
          >
            <p>Drop your files or click here to upload</p>
          </Dropzone> */}
            <img src={this.state.imageUrl} style={{ maxWidth: '100px' }} />
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
        renderLoading={() => (
          <PageWrapper>
            <p>Loading Dapp Page...</p>
          </PageWrapper>
        )}
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
