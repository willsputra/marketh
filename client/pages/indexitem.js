import React from 'react'
import Link from 'next/link'
import Web3Container from '../lib/Web3Container'

class IndexItem extends React.Component {
  state = {
    itemsCount: '',
    items: []
  }

  async componentDidMount() {
    const { contract } = this.props
    const itemsCount = await contract.methods.itemsCount().call()

    const items = await Promise.all(
      Array(parseInt(itemsCount))
        .fill()
        .map((element, index) => {
          return contract.methods.items(index).call()
        })
    )

    this.setState({
      itemsCount: itemsCount,
      items: items
    })
  }

  async buy(itemId, value) {
    const { contract, accounts } = this.props
    
    await contract.methods.buy(itemId).send({
        from: accounts[0],
        gas: 4712388,
        gasPrice: 100000000000,
        value: value
    })
  }

  render() {
    return (
      <div>
        {this.state.items.map((item, index) => (
          <div>
            <p>{item.imageUrl}</p>
            <p>{item.title}</p>
            <p>{item.description}</p>
            <p>{index}</p>
            <button onClick={() => this.buy(index, item.price)}>Buy</button>
          </div>
        ))}
      </div>
    )
  }
}

export default () => (
  <Web3Container
    renderLoading={() => <div>Loading Dapp Page...</div>}
    render={({ web3, accounts, contract }) => (
      <IndexItem accounts={accounts} contract={contract} web3={web3} />
    )}
  />
)
