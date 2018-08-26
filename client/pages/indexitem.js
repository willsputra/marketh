import React from 'react'
import Web3Container from '../lib/Web3Container'
import Link from 'next/link'
import {withRouter} from 'next/router'
import styled from 'styled-components'

import Header from '../components/Header'
import PageWrapper from '../components/PageWrapper'
import Button from '../components/Button'

const ItemWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 20px;
  margin: 30px 0;
`

const Item = styled.div`
  background: white;
  padding: 0px;
`

const ItemImg = styled.div`
  margin: 0 auto;
  height: 270px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
`

const ItemTitle = styled.h2 `
  margin-bottom: -10px;
`

const ItemPrice = styled.p`
  color: #FF6F59;
  font-weight: 700;
  font-size: 16px;
`
const ItemText = styled.div`
  padding: 10px 20px;
`


const BuyButton = styled.button `
  background: #FF6F59;
  color: white;
  padding: 15px 50px;
  margin: 10px 0 20px 0;
  border: 0px;
  border-radius: 3px;
  cursor: pointer;
  font-size: 14px;
`

class IndexItem extends React.Component {

  state = {
    itemsCount: '',
    items: [],
    isStoreOwner: false
  }


  async componentDidMount() {

    const { contract, accounts } = this.props
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

    const storeOwner = await contract.methods.storeToStoreOwner(this.props.routers.query.id).call()
    const isStoreOwner = storeOwner == accounts[0]

    this.setState({
      itemsCount: itemsCount,
      items: filteredItems,
      isStoreOwner: isStoreOwner
    })
  }

  async buy(itemId, value) {
    const { contract, accounts } = this.props
    
    await contract.methods.buy(itemId).send({
        from: accounts[0],
        gas: 4000000,
        gasPrice: 4000000000,
        value: value
    })
  }

  render() {

    let newItem
    if (this.state.isStoreOwner) {
      newItem = (
        <Link
              href={{ pathname: '/newitem', query: { id: this.props.routers.query.id } }} as={`/newitem/${this.props.routers.query.id}`}
          ><a><Button>Add New Item</Button></a></Link>
      )
    }

    return (
      <PageWrapper>
        <Header />
        <Link href={{ pathname: '/indexstore' }}><a><p style={{color: '#56C99D', marginBottom: '40px'}}>{"<"} Back to Stores</p></a></Link>
        <h2>{this.props.routers.query.name}</h2>
        <ItemWrapper>
        {this.state.items.map((item, index) => (
            <Item>
            <ItemImg style={{backgroundImage: `url(${item.imageUrl})`}} />
            <ItemText>
            <ItemTitle>{item.title}</ItemTitle>
            <ItemPrice>{window.web3.fromWei(item.price)} ETH</ItemPrice>
            <p>{item.description}</p>

            {(() => {
             if(item.quantity == 0){
               return <div><p>This item is sold out.</p><BuyButton style={{ background: '#D0D0D0', cursor: 'auto'}}>Sold Out</BuyButton></div>
             } else {
              return <div><p>Only {item.quantity} left!</p><BuyButton onClick={() => this.buy(index, item.price)}>Purchase Item</BuyButton></div>
             }})()}

           {(() => {
             if(this.state.isStoreOwner){
               return  <Link
               href={{ pathname: '/edititem', query: { storeId: this.props.routers.query.id, itemId: index } }} as={`/edititem/${index}`}
           ><a><p style={{color: '#FF6F59'}}>Edit Item</p></a></Link>

           }})()}
            </ItemText>
            </Item>
        ))}
        </ItemWrapper>
      {newItem}
      </PageWrapper>
    )
  }
}

class Page extends React.Component {
    render() {
        return (
            <Web3Container
            renderLoading={() => <PageWrapper><p>Loading Dapp Page...</p></PageWrapper>}
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
