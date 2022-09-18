import styled from "styled-components";

export const UnSavedIndicator = styled.svg`
  height: 8px;
  min-width: 8px;
  background: ${({ theme }) => theme.elements.tab.button.indicator.fill};
  border-radius: 15px;
  &:hover {
    background: ${({ theme }) =>
  theme.elements.tab.button.indicator.hover.fill};
  }
`;
