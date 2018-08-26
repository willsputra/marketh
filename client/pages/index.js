import React from 'react'
import Link from 'next/link'

import Header from '../components/Header'
import PageWrapper from '../components/PageWrapper'
import Button from '../components/Button'
import SecondaryButton from '../components/SecondaryButton'

export default () =>
  <PageWrapper>
    <Header />
    <p>Welcome to Marketh, a marketplace on the blockchain.</p>
    <p>Make sure your MetaMask is unlocked connected to the <strong>Rinkeby</strong> network.</p>
    <p>Click Start to start shopping.</p>
    <Link href = {{ pathname: '/indexstore' }}><a><Button>Start</Button></a></Link>
    <p>If you are a contract owner, go to Admin Tools below to assign store owners.</p>
    <Link href = {{ pathname: '/dapp '}}><a><SecondaryButton>Admin Tools</SecondaryButton></a></Link>
  </PageWrapper>
