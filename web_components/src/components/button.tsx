import styled from 'styled-components'
import React from 'react'

export default styled.button`
    background: ${({ theme }) => theme.elements.primaryButton.background};
    color: ${({ theme }) => theme.elements.primaryButton.color};
    padding: 5px;
    border-radius: 5px;
    border: none;
`