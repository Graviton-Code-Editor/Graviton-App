import styled from 'styled-components'

const TabButtonStyle = styled.div`
    color: white;
    max-width: 200px;
    background: black;
    padding: 10px;
    font-size: 13px;
    border-radius: 7px;
    margin: 2px;
    display: flex;
    min-width: 130px;
    & > p {
        margin: 3px;
        text-overflow: ellipsis;
        overflow: hidden;
        max-width: 70%;
        flex: 1;
        white-space: pre;
        display: block;
    }
`

interface TabButtonOptions {
    title: string
}

export default function TabButton({ title }: TabButtonOptions){
    return (
        <TabButtonStyle>
            <p>{title}</p>
        </TabButtonStyle>
    )
}