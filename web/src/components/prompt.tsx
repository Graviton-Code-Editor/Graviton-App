import styled from "styled-components";
import WindowBackground from "./window_background";

const StyledPromptOption = styled.div`
    color: white;
    margin: 10px;
`

const StyledPrompt = styled.div`
    top: 0;
    left: 0;
    position: fixed;
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    justify-content: center;
    & .prompt {
        border: 1px solid ${({ theme }) => theme.elements.prompt.container.border};;
        margin-top: 20px;
        width: 300px;
        border-radius: 10px;
        height: 200px;
        background: ${({ theme }) => theme.elements.prompt.container.background};
        box-shadow: 0px 2px 10px rgba(0,0,0,0.15);
    }
`

export interface Option {
    label: string,
    onSelected: () => void
}

interface PromptOptions {
    options: Option[]
}

export default function PromptContainer({ options }: PromptOptions) {
    return (
        <>
            <WindowBackground />
            <StyledPrompt>
                <div className="prompt">
                    {options.map(option => {
                        return (
                            <StyledPromptOption key={option.label} onClick={option.onSelected}>{option.label}</StyledPromptOption>
                        )
                    })}
                </div>
            </StyledPrompt>

        </>
    )
}