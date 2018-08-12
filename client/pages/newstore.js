import React from 'react'
import Link from 'next/link'
import Web3Container from '../lib/Web3Container'

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

  render() {
    return (
      <form onSubmit={this.addStore}>
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
        <button>Add Store</button>
      </form>
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
