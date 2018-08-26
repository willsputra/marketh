import React from 'react'
import Link from 'next/link'
import styled from 'styled-components'

import Header from '../components/Header'
import PageWrapper from '../components/PageWrapper'
import Button from '../components/Button'
import SecondaryButton from '../components/SecondaryButton'

const MainTitle = styled.h2`
  font-size: 56px;
  letter-spacing: 5px;
  background: -webkit-linear-gradient(180deg, #56c99d, #66edb9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 20px auto;
  align: center;
`

export default () => (
  <PageWrapper>
    {/* <Header /> */}
      <div style={{margin: '120px auto 50px auto'}}>
      <MainTitle>MARKETH</MainTitle>
      <h2>Welcome to Marketh, a marketplace on the blockchain.</h2>
      </div>
      <p>
        Make sure your MetaMask is unlocked and connected to the{' '}
        <strong>Rinkeby</strong> network. Happy shopping!
      </p>
      <Link href={{ pathname: '/indexstore' }}>
        <a>
          <Button>Start Shopping</Button>
        </a>
      </Link>
      <p>
        If you are the contract owner, go to Admin Tools below to assign store
        owners.
      </p>
      <Link href={{ pathname: '/dapp ' }}>
        <a>
          <p style={{ color: `#56c99d`}}>Admin Tools</p>
        </a>
      </Link>
  </PageWrapper>
)
