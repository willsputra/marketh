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
  height: 250px;
  border-radius: 5px;
  box-shadow: 0px 3px 8px #edeef0;
`

const StoreTitle = styled.h2`
  margin-bottom: -10px;
`

const StoreImg = styled.img`
  width: 100%;
  margin: 0 auto;
`

const NewStoreButton = styled.button`
  background: #56c99d;
  color: white;
  padding: 15px 40px;
  border: 0px;
  border-radius: 3px;
  cursor: pointer;
  margin: 50px auto;
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
            <NewStoreButton>Add New Store</NewStoreButton>
          </a>
        </Link>
      )
    }

    console.log(this.state)
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
    renderLoading={() => <div>Loading Dapp Page...</div>}
    render={({ web3, accounts, contract }) => (
      <IndexStore accounts={accounts} contract={contract} web3={web3} />
    )}
  />
)
