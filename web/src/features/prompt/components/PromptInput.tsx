import styled from "styled-components";

export const PromptInput = styled.input`
  background: ${({ theme }) => theme.elements.primaryButton.background};
  color: ${({ theme }) => theme.elements.primaryButton.color};
  padding: 8px 10px;
  border-radius: 5px;
  border: none;
  outline: none;
  margin-bottom: 8px;
  width: 100%;
  box-sizing: border-box;
  font-size: 14px;
`;
