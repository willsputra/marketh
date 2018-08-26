import React from 'react'
import styled from 'styled-components'

const SecondaryButton = styled.button`
  color: #56c99d;
  padding: 15px 40px;
  outline: 2px solid #56c99d;
  outline-offset: -2px;
  border: 0;
  border-radius: 3px;
  cursor: pointer;
  margin: 40px auto;
  font-size: 14px;
`

export default props => {
  return <SecondaryButton>{props.children}</SecondaryButton>
}
