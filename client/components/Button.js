import React from 'react'
import styled from 'styled-components'

const Button = styled.button `
  background: #56C99D;
  color: white;
  padding: 15px 40px;
  border: 0px;
  border-radius: 3px;
  cursor: pointer;
  margin: 50px auto;
`

export default (props) => {
    return (
    <Button>{props.children}</Button>
    )
}