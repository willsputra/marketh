import React from 'react'
import Link from 'next/link'
import Web3Container from '../lib/Web3Container'

class Withdraw extends React.Component {
  constructor(props) {
    super(props)

    this.withdraw = this.withdraw.bind(this)
  }

  state = {
    pendingWithdrawals: ''
  }

  async getPendingWithdrawals() {
    const { accounts, contract } = this.props
    const pendingWithdrawals = await contract.methods.pendingWithdrawals(accounts[0]).call()

    this.setState ({
      pendingWithdrawals: pending
    })
  }

  async withdraw() {
    const { accounts, contract } = this.props
    await contract.methods.withdraw().send({
      from: accounts[0]
    })
  }

  render() {
    {this.getPendingWithdrawals()}
    <p>{this.state.pendingWithdrawals}</p>
    return <button onClick={this.withdraw}>Withdraw</button>
  }
}

export default () => (
  <Web3Container
    renderLoading={() => <div>Loading Dapp Page...</div>}
    render={({ web3, accounts, contract }) => (
      <Withdraw accounts={accounts} contract={contract} web3={web3} />
    )}
  />
)
