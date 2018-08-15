import React from 'react'
import Link from 'next/link'
import Web3Container from '../lib/Web3Container'

class NewItem extends React.Component {
  constructor(props) {
    super(props)

    this.addItem = this.addItem.bind(this)
  }

  state = {
    storeId: '',
    imageUrl: '',
    title: '',
    description: '',
    price: '',
    quantity: ''
  }

  async addItem(event) {
    event.preventDefault()

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
      .addItem(storeId, imageUrl, title, description, price, quantity)
      .send({
        from: accounts[0],
        gas: 4712388,
        gasPrice: 100000000000
      })
  }

  render() {
    return (
      <form onSubmit={this.addItem}>
        <p>storeId</p>
        <input
          value={this.state.storeId}
          onChange={event => this.setState({ storeId: event.target.value })}
        />
        <p>imageUrl</p>
        <input
          value={this.state.imageUrl}
          onChange={event => this.setState({ imageUrl: event.target.value })}
        />
        <p>title</p>
        <input
          value={this.state.title}
          onChange={event => this.setState({ title: event.target.value })}
        />
        <p>description</p>
        <input
          value={this.state.description}
          onChange={event => this.setState({ description: event.target.value })}
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
        <button>Add Item</button>
      </form>
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
