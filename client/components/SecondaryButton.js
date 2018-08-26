import React from 'react'
import styled from 'styled-components'

const SecondaryButton = styled.button `
  color: #56C99D;
  padding: 15px 40px;
  outline: 2px solid #56C99D;
  outline-offset: -2px;
  border: 0;
 border-radius: 3px;
  cursor: pointer;
  margin: 50px auto;
`

export default (props) => {
    return (
    <SecondaryButton>{props.children}</SecondaryButton>
    )
}