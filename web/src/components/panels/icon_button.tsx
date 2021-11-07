import styled from "styled-components";

const StyledIconButton = styled.button<{ selected: boolean }>`
    padding: 5px;
    background: ${({ selected, theme }) => selected ? theme.elements.sidebar.button.selected.background : theme.elements.sidebar.button.background};
    border: 0;
    box-shadow: 0px 2px 10px rgba(0,0,0,0.15);
    height: 50px;
    width: 50px;
	justify-content: center;
	align-items: center;
	border-radius: 5px;
	overflow: hidden;
    margin: 2px;
	&:hover {
		transition: 0.1s;
        background: ${({ selected, theme }) => !selected && theme.elements.sidebar.button.hover.background}
	}
`
export default StyledIconButton;