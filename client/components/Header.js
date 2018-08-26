import React from 'react'
import Link from 'next/link'
import Web3Container from '../lib/Web3Container'
import styled from 'styled-components'

const HeaderWrapper = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  align-items: center;
  `
const HeaderTitle = styled.h2`
  font-size: 32px;
  letter-spacing: 5px;
  background: -webkit-linear-gradient(180deg, #56C99D, #66EDB9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

const Nav = styled.div`
  text-align: right;
  line-height: 0.9;
`

const Header = ({ accounts }) => (
    <HeaderWrapper>
    <Link href = {{pathname: '/indexstore'}}><a><HeaderTitle>MARKETH</HeaderTitle></a></Link>
    <Nav>
      <p>{accounts}</p>
      <p><Link href = {{pathname: '/purchasehistory'}}><a>PURCHASE HISTORY</a></Link></p>
      <p><Link href = {{pathname: '/withdraw'}}><a>WITHDRAW</a></Link></p>
    </Nav>
    </HeaderWrapper>
)

export default () => (
    <Web3Container
      renderLoading={() => <div>Loading Accounts Page...</div>}
      render={({ accounts }) => <Header accounts={accounts} />}
    />
  )
  