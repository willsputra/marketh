import React from 'react'
import Web3Container from '../lib/Web3Container'
import {withRouter} from 'next/router'

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
    console.log(this.props)

    return (
      <div>
        {this.state.items.map((item, index) => (
          <div>
            <p><strong>store {item.storeId}</strong></p>
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

class Page extends React.Component {
    render() {
        return (
            <Web3Container
            renderLoading={() => <div>Loading Dapp Page...</div>}
            render={({ web3, accounts, contract }) => (
              <IndexItem accounts={accounts} contract={contract} web3={web3} routers={this.props.router} />
            )}
          />
        )
    }
}

export default withRouter(Page)

// export default ({url}) => (
//   <Web3Container
//     renderLoading={() => <div>Loading Dapp Page...</div>}
//     render={({ web3, accounts, contract }) => (
//       <IndexItem accounts={accounts} contract={contract} web3={web3} url={url}/>
//     )}
//   />
// )
