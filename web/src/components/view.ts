import styled from 'styled-components'

const View = styled.div`
    background: ${({ theme }) => theme.elements.view.background};
    min-height: 100%;
    max-height: 100%;
    & > div:nth-child(2) {
        max-height: calc(100% - 40px);
        margin: 10px;
    }
    & .Pane > div {
        height: 100%;
        width: 100%;
    }
`

export default View;