import React from 'react'
import Web3Container from '../lib/Web3Container'
import Link from 'next/link'
import styled from 'styled-components'
import Dotdotdot from 'react-dotdotdot'

import Header from '../components/Header'
import PageWrapper from '../components/PageWrapper'

const StoreWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 20px;
`

const Store = styled.div`
  background: white;
  padding: 30px;
`

const StoreTitle = styled.h2 `
  margin-bottom: -10px;
`

const StoreImg = styled.img `
  width: 100%;
  margin: 0 auto;
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
      <PageWrapper>
        <Header />
        <StoreWrapper>
          {this.state.stores.map((store, index) => (
            <Link
              href={{ pathname: '/indexitem', query: { id: index } }}
              as={`/store/${index}`}
            >
              <a>
                <Store>
                  <StoreImg src={store.imageUrl} />
                  <StoreTitle>{store.title}</StoreTitle>
                  <Dotdotdot clamp={2}><p>{store.description}</p></Dotdotdot>
                </Store>
              </a>
            </Link>
          ))}
        </StoreWrapper>
      </PageWrapper>
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
