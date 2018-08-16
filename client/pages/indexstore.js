import React from 'react'
import Web3Container from '../lib/Web3Container'
import Link from 'next/link'
import styled from 'styled-components'

const StoreWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 20px;
`

const Store = styled.div`
    border: 1px solid black;
    text-align: center;
`

class IndexStore extends React.Component {
  state = {
    storesCount: '',
    stores: []
  }

  async componentDidMount() {
    const { accounts, contract } = this.props
    const storesCount = await contract.methods.storesCount().call()

    const stores = await Promise.all(
      Array(parseInt(storesCount))
        .fill()
        .map((element, index) => {
          return contract.methods.stores(index).call()
        })
    )

    this.setState({
      storesCount: storesCount,
      stores: stores
    })
  }

  render() {
    return (
      <StoreWrapper>
        {this.state.stores.map((store, index) => (
        <Link href={{ pathname: '/indexitem', query: { id: index }}} as={`/store/${index}`}>
        <a>
          <Store>
            <p>{store.imageUrl}</p>
            <p>{store.title}</p>
            <p>{store.description}</p>
          </Store>
          </a>
          </Link>
        ))}
      </StoreWrapper>
    )
  }
}


export default () => (
  <Web3Container
    renderLoading={() => <div>Loading Dapp Page...</div>}
    render={({ web3, accounts, contract }) => (
      <IndexStore accounts={accounts} contract={contract} web3={web3} />
    )}
  />
)
