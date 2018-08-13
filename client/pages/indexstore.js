import React from 'react'
import Link from 'next/link'
import Web3Container from '../lib/Web3Container'

class IndexStore extends React.Component {


    // static async getInitialProps(props) {
    //     const { accounts, contract } = props
    //     const storesCount = await contract.methods.storesCount().call()

    //     const stores = await Promise.all(
    //         Array(parseInt(storesCount)).fill().map((element, index) => {
    //             return contract.methods.stores(index).call()
    //         })
    //     )

    //     return { storesCount, stores }
    // }

    state = {
        storesCount: '',
        stores: []
    }

    constructor(props){
        super(props)

        // this.getStores = this.getStores.bind(this)
    }

    async componentDidMount() {
        const { accounts, contract } = this.props
        const storesCount = await contract.methods.storesCount().call()

        const stores = await Promise.all(
            Array(parseInt(storesCount)).fill().map((element, index) => {
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
            <div>
                {this.state.stores.map(store => <div><p>{store.imageUrl}</p><p>{store.title}</p><p>{store.description}</p></div>)}
            </div>
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