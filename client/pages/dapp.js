import React from 'react'
import Link from 'next/link'
import Web3Container from '../lib/Web3Container'

import Header from '../components/Header'
import PageWrapper from '../components/PageWrapper'
import Button from '../components/Button'

class Dapp extends React.Component {

  constructor(props) {
    super(props)
    this.addStoreOwner = this.addStoreOwner.bind(this)
    this.getStoreOwnersCount = this.getStoreOwnersCount.bind(this)
    this.storeOwners = this.storeOwners.bind(this)
  }

  state = {
    balance: undefined,
    ethBalance: undefined,
    storeOwner: undefined,
    storeOwnersCount: undefined,
    storeOwners: undefined,
    isStoreOwner: ''
  };

  async addStoreOwner(event) {
    event.preventDefault()

    const { accounts, contract } = this.props
    await contract.methods.addStoreOwner(this.state.storeOwner).send({ from: accounts[0] })
  }

  async storeOwners(event){
    event.preventDefault()

    const{ accounts, contract } = this.props
    const response = await contract.methods.storeOwners(this.state.storeOwners).call()
    this.setState({
      isStoreOwner: response
    })
    console.log(response)
  }

  async getStoreOwnersCount() {
    const { accounts, contract } = this.props
    const response = await contract.methods.storeOwnersCount().call()
    this.setState({
      storeOwnersCount: response
    })
  }

  
  render (accounts) {

    return(
    <PageWrapper>
      <Header />

      <form onSubmit = {this.addStoreOwner}>
      <p><strong>1. Assign an address as a store owner</strong></p>
      <p>Enter an address to assign it as a store owner. Make sure you run the function from the contract owner address.</p>
        <input value = {this.state.storeOwner} onChange = {event => this.setState({storeOwner: event.target.value })}/>
        <button>Add</button>
      </form>

      <form onSubmit = {this.storeOwners}>
      <p><strong>2. Check if store owner assignment is successful</strong></p>
      <p>After the transaction has been completed, enter the address again here to check if the address is a store owner.</p>
        <input value = {this.state.storeOwners} onChange = {event => this.setState (
          {storeOwners: event.target.value }
        )}/>
      <button>Check</button>
      </form>

      <p>{this.state.isStoreOwner.toString()}</p>

      <p><strong>3. Check how many store owners are there</strong></p>
      <button onClick={this.getStoreOwnersCount}>Store Owner Count</button>
      <p>{this.state.storeOwnersCount}</p>


      <Link href = {{ pathname: '/indexstore' }}><a><Button>Go to Store</Button></a></Link>

    </PageWrapper>
    )
  }
}

export default () => (
  <Web3Container
    renderLoading={() => <PageWrapper><p>Loading Dapp Page...</p></PageWrapper>}
    render={({ web3, accounts, contract }) => (
      <Dapp accounts={accounts} contract={contract} web3={web3} />
    )}
  />
)
