import React from 'react'
import getWeb3 from './getWeb3'
import getContract from './getContract'
import contractDefinition from './contracts/Marketh.json'

export default class Web3Container extends React.Component {
  state = { web3: null, accounts: null, contract: null };

  async componentDidMount () {
    try {
      const web3 = await getWeb3()
      // const ens = await getENS()
      const accounts = await web3.eth.getAccounts()
      const contract = await getContract(web3, contractDefinition)
      // const address = ens.reverse(accounts[0]).name()

      // Reload when Metamask change
      setInterval(async function() {
        const refreshedAccounts = await web3.eth.getAccounts()

        if(refreshedAccounts[0] !== accounts[0]) {
          window.location.reload()
        }
      }, 1000)

      this.setState({ web3, accounts, contract })
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      )
      console.log(error)
    }
  }

  render () {
    const { web3, accounts, contract } = this.state
    return web3 && accounts
      ? this.props.render({ web3, accounts, contract })
      : this.props.renderLoading()
  }
}
