import { PropsWithChildren, ReactElement } from 'react'
import styled from 'styled-components'

const TabContainerStyle = styled.div`
    
`

interface TabContainerOptions extends PropsWithChildren<any> {
  
}

export default function TabContainer({ title, children }: TabContainerOptions){
    return (
        <TabContainerStyle>
            {children}
        </TabContainerStyle>
    )
}