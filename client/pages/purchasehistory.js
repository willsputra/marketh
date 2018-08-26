import React from 'react'
import Link from 'next/link'
import Web3Container from '../lib/Web3Container'

import styled from 'styled-components'

import Header from '../components/Header'
import PageWrapper from '../components/PageWrapper'


const Purchase = styled.div`
  background: white;
  padding: 10px;
  display: grid;
  grid-template-columns: 1fr 3fr;
  margin: 10px auto;
`

const PurchaseImg = styled.img`
  margin: 0 auto;
  max-height: 100px;
`

const PurchaseTitle = styled.h2`
  margin-bottom: -10px;
`

class PurchaseHistory extends React.Component {
  state = {
    purchases: [],
    items: [],
  }

  async componentDidMount() {
    const { accounts, contract } = this.props
    const purchaseHistory = await contract.methods
      .getPurchaseHistory(accounts[0])
      .call()

    const items = purchaseHistory.map(async (purchases, index) => {
      return contract.methods.items(purchases).call()
    })

    Promise.all(items).then(response => {
      this.setState({
        items: response
      })
    })
 
    this.setState({
      purchases: purchaseHistory
    })
  }

  render() {
    return (
      <PageWrapper>
        <Header />
        <Link href={{ pathname: '/indexstore' }}><a><p style={{color: '#56C99D', marginBottom: '40px'}}>{"<"} Back to Stores</p></a></Link>

        {this.state.items.map((item, index) => (
          <Purchase>
            <PurchaseImg src = {`${item.imageUrl}`} />
            <div><PurchaseTitle>{item.title}</PurchaseTitle>
            <p>{window.web3.fromWei(item.price)} ETH</p>
            </div>
          </Purchase>
        ))}
      </PageWrapper>
    )
  }
}

export default () => (
  <Web3Container
    renderLoading={() => (
      <PageWrapper>
        <p>Loading Dapp Page...</p>
      </PageWrapper>
    )}
    render={({ web3, accounts, contract }) => (
      <PurchaseHistory accounts={accounts} contract={contract} web3={web3} />
    )}
  />
)
