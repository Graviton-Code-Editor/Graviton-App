import styled from 'styled-components'

const View = styled.div`
    background: ${({ theme }) => theme.elements.view.background};
    min-height: 100%;
    max-height: 100%;
    & .Pane > div {
        height: 100%;
        width: 100%;
    }
`

export default View;