import React from 'react'
import Web3Container from '../lib/Web3Container'
import Link from 'next/link'
import {withRouter} from 'next/router'
import styled from 'styled-components'

import Header from '../components/Header'
import PageWrapper from '../components/PageWrapper'

const ItemWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 20px;
`

const Item = styled.div`
  background: white;
  padding: 30px;
`

const ItemTitle = styled.h2 `
  margin-bottom: -10px;
`

const BuyButton = styled.button `
  background: #56C99D;
  color: white;
  padding: 10px 40px;
  border: 0px;
  border-radius: 3px;
  cursor: pointer;
`

const NewItemButton = styled.button `
  background: #56C99D;
  color: white;
  padding: 15px 40px;
  border: 0px;
  border-radius: 3px;
  cursor: pointer;
  margin: 50px auto;
`

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

    console.log(items)

    const filteredItems = items.filter(item => item.storeId == this.props.routers.query.id)

    console.log('filter',filteredItems)

    this.setState({
      itemsCount: itemsCount,
      items: filteredItems
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
    console.log(this.state)

    return (
      <PageWrapper>
        <Header />
        <ItemWrapper>
        {this.state.items.map((item, index) => (
            <Item>
            <img src={item.imageUrl} />
            <ItemTitle>{item.title}</ItemTitle>
            <p>{item.description}</p>
            <p>{window.web3.fromWei(item.price)} ETH</p>
            <p>Only {item.quantity} left!</p>
            <BuyButton onClick={() => this.buy(index, item.price)}>Buy</BuyButton>
            </Item>
        ))}
        </ItemWrapper>
        <Link
              href={{ pathname: '/newitem', query: { id: this.props.routers.query.id } }} as={`/newitem/${this.props.routers.query.id}`}
          ><NewItemButton>Add New Item</NewItemButton></Link>
      </PageWrapper>
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
