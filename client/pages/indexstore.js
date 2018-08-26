import React from 'react'
import Web3Container from '../lib/Web3Container'
import Link from 'next/link'
import styled from 'styled-components'
import Dotdotdot from 'react-dotdotdot'

import Header from '../components/Header'
import PageWrapper from '../components/PageWrapper'
import Button from '../components/Button'

const StoreWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 20px;
`

const Store = styled.div`
  background: white;
  padding: 20px;
  height: 300px;
  border-radius: 5px;
  box-shadow: 0px 3px 8px #edeef0;
`

const StoreTitle = styled.h2`
  margin-bottom: -10px;
`

const StoreImg = styled.div`
  margin: 0 auto;
  height: 200px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
`

class IndexStore extends React.Component {
  state = {
    storesCount: '',
    stores: [],
    isStoreOwner: false
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

    const storeOwner = await contract.methods.storeOwners(accounts[0]).call()

    this.setState({
      storesCount: storesCount,
      stores: stores,
      isStoreOwner: storeOwner
    })
  }
  render() {

    
    let newStore
    if (this.state.isStoreOwner) {
      newStore = (
        <Link href={{ pathname: '/newstore' }}>
          <a>
            <Button>Add New Store</Button>
          </a>
        </Link>
      )
    }

    console.log(this.state)
    return (
      <PageWrapper>
        <Header />
        <h2>Store List</h2>
        <StoreWrapper>
          {this.state.stores.map((store, index) => (
            <Link
              href={{ pathname: '/indexitem', query: { id: index, name: store.title } }}
              as={`/store/${index}`}
            >
              <a>
                <Store>
                  <StoreImg style={{backgroundImage: `url(${store.imageUrl})`}}></StoreImg>
                  <StoreTitle>{store.title}</StoreTitle>
                  <Dotdotdot clamp={2}>
                    <p>{store.description}</p>
                  </Dotdotdot>
                </Store>
              </a>
            </Link>
          ))}
        </StoreWrapper>
        {newStore}
      </PageWrapper>
    )
  }
}

export default () => (
  <Web3Container
    renderLoading={() => <PageWrapper><p>Loading Dapp Page...</p></PageWrapper>}
    render={({ web3, accounts, contract }) => (
      <IndexStore accounts={accounts} contract={contract} web3={web3} />
    )}
  />
)
