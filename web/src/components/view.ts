import styled from 'styled-components'

const View = styled.div`
    display: flex;
    background: ${({ theme }) => theme.elements.view.background};
    min-height: 100%;
    & > div {
        flex: 1;
    }
`

export default View;