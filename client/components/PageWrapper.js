import React from 'react'
import styled from 'styled-components'

const PageWrapper = styled.div`
    width: 90%
    margin: 20px auto
    padding: 20px
    max-width: 1000px
`

export default (props) => {
    return (
    <PageWrapper>{props.children}</PageWrapper>
    )
}