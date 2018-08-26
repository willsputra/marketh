import React from 'react'
import Link from 'next/link'
import Web3Container from '../lib/Web3Container'

import Header from '../components/Header'
import PageWrapper from '../components/PageWrapper'

class Withdraw extends React.Component {
  constructor(props) {
    super(props)

    this.withdraw = this.withdraw.bind(this)
    this.getPendingWithdrawals = this.getPendingWithdrawals.bind(this)
  }

  state = {
    pendingWithdrawals: ''
  }

  async getPendingWithdrawals() {
    const { accounts, contract } = this.props
    const pendingWithdrawals = await contract.methods.pendingWithdrawals(accounts[0]).call()

    this.setState ({
      pendingWithdrawals: window.web3.fromWei(pendingWithdrawals, 'ether')
    })
  }

  async withdraw() {
    const { accounts, contract } = this.props
    await contract.methods.withdraw().send({
      from: accounts[0],
      gas: 4712388,
      gasPrice: 100000000000
    })
  }

  render() {
    this.getPendingWithdrawals()
    return(
    <PageWrapper>
      <Header />
      <Link href={{ pathname: '/indexstore' }}><a><p style={{color: '#56C99D', marginBottom: '40px'}}>{"<"} Back to Store List</p></a></Link>
      <h2>Withdraw</h2>
      <p>Available balance to withdraw: <strong>{this.state.pendingWithdrawals} ETH</strong></p>
      <button onClick={this.withdraw}>Withdraw</button>
    </PageWrapper>
    )
  }
}

export default () => (
  <Web3Container
    renderLoading={() => <PageWrapper><p>Loading Dapp Page...</p></PageWrapper>}
    render={({ web3, accounts, contract }) => (
      <Withdraw accounts={accounts} contract={contract} web3={web3} />
    )}
  />
)
