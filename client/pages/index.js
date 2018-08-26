import React from 'react'
import Link from 'next/link'
import styled from 'styled-components'

const MainWrapper = styled.div`
    width: 90%
    margin: 5vh auto
    padding: 20px
    max-width: 1000px
`

const MainTitle = styled.h2`
  font-size: 32px;
  letter-spacing: 5px;
  background: -webkit-linear-gradient(180deg, #56c99d, #66edb9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 20px auto 60px auto;
  align: center;
`

const MainButton = styled.button`
  background-image: -webkit-linear-gradient(0deg, #56c99d, #66edb9);
  color: white;
  padding: 20px 60px;
  border: 0px;
  border-radius: 3px;
  cursor: pointer;
  margin: 0px auto;
  font-size: 18px;
`

export default () => (
  <MainWrapper>
    <div style={{ margin: '80px auto 50px auto' }}>
      <div>
        <MainTitle>MARKETH</MainTitle>

        <h1>
          Buy & sell anything
          <br /> on the blockchain
        </h1>
        <Link href={{ pathname: '/indexstore' }}>
          <a>
            {' '}
            <MainButton>Start Shopping </MainButton>
          </a>
        </Link>
      </div>

      <div
        style={{
          backgroundImage: '-webkit-linear-gradient(180deg, #56C99D, #66EDB9)',
          height: '5px',
          marginTop: '80px'
        }}
      />
    </div>

    <p>
      Make sure your MetaMask is unlocked and connected to the{' '}
      <strong>Rinkeby</strong> network. Happy shopping!
    </p>
    <p>
      If you are the contract owner, go to Admin Tools below to assign store
      owners.
    </p>
    <Link href={{ pathname: '/dapp ' }}>
      <a>
        <p style={{ color: `#56c99d` }}>Admin Tools</p>
      </a>
    </Link>
    <p style={{ fontSize: '12px', marginTop: '50px' }}>
      Created by{' '}
      <Link href={{ pathname: 'https://willsputra.xyz' }}>
        <a target="_blank"> William Goi</a>
      </Link>
      .
    </p>
    <p style={{ fontSize: '12px' }}>
      View the source code on{' '}
      <Link href={{ pathname: 'https://github.com/willsputra/marketh' }}>
        <a target="_blank">Github</a>
      </Link>
      .
    </p>
  </MainWrapper>
)
