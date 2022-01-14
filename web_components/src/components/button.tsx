import styled from 'styled-components'
import React from 'react'

export const Button =  styled.button`
    background: ${({ theme }) => theme.elements.primaryButton.background};
    color: ${({ theme }) => theme.elements.primaryButton.color};
    padding: 7px;
    border-radius: 5px;
    border: none;
    cursor: pointer;
`

export const BorderedButton = styled.button<{expanded: boolean}>`
    background: ${({ theme }) => theme.elements.primaryButtonBordered.background};
    color: ${({ theme }) => theme.elements.primaryButton.color};
    padding: 7px;
    border-radius: 5px;
    border: none;
    cursor: pointer;
    margin-top: 5px;
    ${({ expanded }) => expanded && "width: 100%;"}
    &:hover {
        background: ${({ theme }) => theme.elements.primaryButtonBordered.hover.background};
    }
`