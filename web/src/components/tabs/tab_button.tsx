import { PropsWithChildren } from 'react'
import styled from 'styled-components'

const TabButtonStyle = styled.div<PropsWithChildren<any>>`
    color: white;
    max-width: 200px;
    background: black;
    padding: 5px 10px;
    font-size: 13px;
    border-radius: 7px;
    margin: 3px;
    display: flex;
    min-width: 130px;
    max-width: 150px;
    max-height: 36px;
    align-items: center;
    &.selected {
        background: gray;
    }
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
    title: string,
    isSelected: boolean,
    select: () => void
}

export default function TabButton({ title, isSelected, select }: TabButtonOptions){
    return (
        <TabButtonStyle className={isSelected && 'selected'} onClick={select}>
            <p>{title}</p>
        </TabButtonStyle>
    )
}