import React from 'react'
import Web3Container from '../lib/Web3Container'

const Header = ({ accounts }) => (
    <p>{accounts}</p>
)

export default () => (
    <Web3Container
      renderLoading={() => <div>Loading Accounts Page...</div>}
      render={({ accounts }) => <Header accounts={accounts} />}
    />
  )
  